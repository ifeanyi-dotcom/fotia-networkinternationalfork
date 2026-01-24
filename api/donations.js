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
        const {
            fullName,
            email,
            phone,
            prayerRequest,
            amount, // This is now a string like "5000" or "N/A"
            donationType, // 'one-time' or 'monthly'
            paymentReference, // Can be null if it's a bank transfer
            status // 'completed' or 'active'
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({ message: 'Missing required fields: fullName, email, and phone are required.' });
        }

        const client = await clientPromise;
        const db = client.db('Fotia_db');
        const donationsCollection = db.collection('donations');

        const donationRecord = {
            fullName,
            email,
            phone,
            prayerRequest: prayerRequest || '',
            amount: amount || 'N/A',
            donationType: donationType || 'one-time',
            status: status || 'completed',
            paymentReference: paymentReference || null,
            createdAt: new Date(),
            paymentVerifiedAt: paymentReference ? new Date() : null, // Mark as verified if we have a ref
            ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
            emailError: null,
            emailId: null,
            welcomeEmailSent: false,
            welcomeEmailSentAt: null,
        };

        const result = await donationsCollection.insertOne(donationRecord);
        const donationId = result.insertedId;

        // Send appropriate email based on donation type
        try {
            const isMonthly = donationType === 'monthly';
            const templateType = isMonthly ? 'monthly_welcome' : 'onetime_thankyou';

            // Parse amount properly - remove commas and convert to number
            const cleanAmount = amount && amount !== 'N/A'
                ? parseInt(amount.toString().replace(/,/g, ''), 10)
                : undefined;

            const emailResponse = await sendSkrybeEmail({
                to: email,
                templateType: templateType,
                data: {
                    name: fullName.split(' ')[0], // First name
                    amount: cleanAmount,
                }
            });

            await donationsCollection.updateOne(
                { _id: donationId },
                { $set: { 
                    welcomeEmailSent: true, 
                    welcomeEmailSentAt: new Date(),
                    emailId: emailResponse.id || null
                }}
            );
            console.log(`Successfully sent ${templateType} email for donation ${donationId}`);

        } catch (emailError) {
            console.error(`Failed to send email for donation ${donationId}:`, emailError);
            await donationsCollection.updateOne(
                { _id: donationId },
                { $set: { emailError: emailError.message, welcomeEmailSent: false } }
            );
        }

        return res.status(201).json({
            success: true,
            message: 'Thank you! Your details have been successfully recorded.',
            donationId: donationId
        });

    } catch (error) {
        console.error('Error processing donation registration:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}