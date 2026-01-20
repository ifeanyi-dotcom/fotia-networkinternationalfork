import clientPromise from './utils/db.js';
import resend from './utils/resend.js';
import { getPaystackLink, isPresetAmount } from './utils/paystack-links.js';
import { render } from '@react-email/render';
import OneTimeDonorEmail from './emails/OneTimeDonorEmail.jsx';
import MonthlyPartnerEmail from './emails/MonthlyPartnerEmail.jsx';

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
        const { fullName, email, phone, donationType, monthlyAmount, oneTimeAmount } = req.body;

        // Validate required fields
        if (!fullName || !email || !donationType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('fotia-network');
        const donations = db.collection('donations');

        // Create donation record
        const donation = {
            fullName,
            email,
            phone,
            donationType,
            monthlyAmount: donationType === 'monthly' ? monthlyAmount : null,
            oneTimeAmount: donationType === 'one-time' ? oneTimeAmount : null,
            createdAt: new Date(),
            emailSent: false,
        };

        // Save to MongoDB
        const result = await donations.insertOne(donation);
        console.log('Donation saved:', result.insertedId);

        // Send confirmation email
        try {
            let emailHtml;
            let subject;

            if (donationType === 'one-time') {
                // Template A: One-Time Donor
                emailHtml = await render(
                    OneTimeDonorEmail({
                        donorName: fullName.split(' ')[0], // First name only
                        amount: oneTimeAmount,
                    })
                );
                subject = 'Thank You for Your Gift to Fotia Network!';
            } else {
                // Template B: Monthly Partner
                const paystackLink = getPaystackLink(monthlyAmount);
                const isCustom = !isPresetAmount(monthlyAmount);

                emailHtml = await render(
                    MonthlyPartnerEmail({
                        donorName: fullName.split(' ')[0], // First name only
                        amount: monthlyAmount,
                        paystackLink: paystackLink,
                        isCustomAmount: isCustom,
                    })
                );
                subject = 'Welcome to the Fotia Partner Family!';
            }

            // Send email via Resend
            const emailResult = await resend.emails.send({
                from: 'Fotia Network <partners@fotianetwork.org>',
                to: [email],
                subject: subject,
                html: emailHtml,
            });

            console.log('Email sent successfully:', emailResult);

            // Update donation record to mark email as sent
            await donations.updateOne(
                { _id: result.insertedId },
                { $set: { emailSent: true, emailId: emailResult.id } }
            );

        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Don't fail the request - donation was saved successfully
            // Just log the error for monitoring
        }

        return res.status(201).json({
            message: 'Donation recorded successfully',
            donationId: result.insertedId
        });

    } catch (error) {
        console.error('Error processing donation:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
