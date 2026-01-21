import clientPromise from './utils/db.js';
import { sendSkrybeEmail } from './utils/skrybe.js';
import { ObjectId } from 'mongodb'; // Import ObjectId for database operations

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { fullName, email, phone, donationType, amount, prayerRequest, selectedAmountTier } = req.body;

        // Validate required fields
        if (!fullName || !email || !donationType || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('Fotia_db');
        const donationsCollection = db.collection('donations');

        // Parse amount - remove commas if present, convert to number
        const parsedAmount = parseFloat(amount.toString().replace(/,/g, ''));

        let donationRecord = {
            fullName,
            email,
            phone,
            amount: amount.toString(), // Store original amount string
            prayerRequest: prayerRequest || '',
            donationType,
            createdAt: new Date(),
            ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
            emailError: null,
            emailId: null,
            emailSent: false,
            emailSentAt: null,
            // New fields, default to null or false
            paymentReference: null,
            selectedAmountTier: null,
            paystackCustomerId: null,
            paymentVerifiedAt: null,
            welcomeEmailSent: false,
            welcomeEmailSentAt: null,
        };

        let redirectUrl = null;

        if (donationType === 'one-time') {
            donationRecord.status = 'completed'; // One-time gifts are immediately completed

            const result = await donationsCollection.insertOne(donationRecord);
            const donationId = result.insertedId;

            try {
                // Send thank you email via Skrybe immediately
                const emailResponse = await sendSkrybeEmail({
                    to: email,
                    templateType: 'onetime_thankyou',
                    data: {
                        name: fullName.split(' ')[0], // First name only
                        amount: parsedAmount.toLocaleString() // Formatted amount for email
                    }
                });

                donationRecord.emailSent = true;
                donationRecord.emailSentAt = new Date();
                donationRecord.emailId = emailResponse.id || null;
                console.log('One-time thank you email sent successfully via Skrybe:', emailResponse);

            } catch (emailError) {
                console.error('Failed to send one-time thank you email:', emailError);
                donationRecord.emailError = emailError.message;
                donationRecord.emailSent = false;
            } finally {
                // Update the donation record with email status after sending attempt
                await donationsCollection.updateOne(
                    { _id: donationId },
                    { $set: {
                        emailSent: donationRecord.emailSent,
                        emailSentAt: donationRecord.emailSentAt,
                        emailError: donationRecord.emailError,
                        emailId: donationRecord.emailId
                    }}
                );
            }

            return res.status(201).json({
                success: true,
                message: 'Thank you for your gift!',
                donationId: donationId,
                redirectUrl: null
            });

        } else if (donationType === 'monthly') {
            // Generate unique paymentReference
            const paymentReference = `FOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            donationRecord.paymentReference = paymentReference;
            donationRecord.status = 'pending_payment'; // Monthly partners await Paystack confirmation
            donationRecord.selectedAmountTier = selectedAmountTier || 'custom'; // Store selected tier

            const result = await donationsCollection.insertOne(donationRecord);
            const donationId = result.insertedId;

            // Build redirect URL based on selectedAmountTier
            const paystackLinks = {
                '10000': 'https://paystack.shop/pay/10fotiamonthly',
                '20000': 'https://paystack.shop/pay/20fotiamonthly',
                '50000': 'https://paystack.shop/pay/50fotiamonthly',
                '100000': 'https://paystack.shop/pay/100fotiamonthly',
                'custom': 'https://paystack.shop/pay/fotiamonthly'
            };

            const baseUrl = paystackLinks[selectedAmountTier] || paystackLinks['custom'];
            redirectUrl = `${baseUrl}?reference=${paymentReference}`;

            return res.status(201).json({
                success: true,
                message: 'Redirecting to payment...',
                donationId: donationId,
                redirectUrl: redirectUrl
            });

        } else {
            return res.status(400).json({ message: 'Invalid donation type' });
        }

    } catch (error) {
        console.error('Error processing donation:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}