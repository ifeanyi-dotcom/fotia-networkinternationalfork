import resend from './utils/resend.js';
import clientPromise from './utils/db.js';
import { ObjectId } from 'mongodb';
import { render } from '@react-email/render';
import OneTimeDonorEmail from './emails/OneTimeDonorEmail.jsx';
import MonthlyPartnerEmail from './emails/MonthlyPartnerEmail.jsx';
import { getPaystackLink, isPresetAmount } from './utils/paystack-links.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { donationId } = req.body;

        if (!donationId) {
            return res.status(400).json({ error: 'Donation ID is required' });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('Fotia_db');
        const donations = db.collection('donations');

        // Find the donation
        const donation = await donations.findOne({ _id: new ObjectId(donationId) });

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        // Parse the amount from database (remove commas)
        const parsedAmount = donation.amount ? parseInt(donation.amount.toString().replace(/,/g, '')) : 0;

        // Generate email based on donation type
        let emailHtml;
        let subject;

        if (donation.donationType === 'one-time') {
            emailHtml = await render(
                OneTimeDonorEmail({
                    donorName: donation.fullName.split(' ')[0],
                    amount: parsedAmount,
                })
            );
            subject = 'Thank You for Your Gift to Fotia Network!';
        } else {
            const paystackLink = getPaystackLink(parsedAmount);
            const isCustom = !isPresetAmount(parsedAmount);

            emailHtml = await render(
                MonthlyPartnerEmail({
                    donorName: donation.fullName.split(' ')[0],
                    amount: parsedAmount,
                    paystackLink: paystackLink,
                    isCustomAmount: isCustom,
                })
            );
            subject = 'Welcome to the Fotia Partner Family!';
        }

        // Send email via Resend
        const emailResponse = await resend.emails.send({
            from: 'Fotia Network <partners@fotianetwork.org>',
            to: [donation.email],
            subject: subject,
            html: emailHtml,
        });

        // Update donation record with email status
        await donations.updateOne(
            { _id: new ObjectId(donationId) },
            {
                $set: {
                    emailSent: true,
                    emailId: emailResponse.id,
                    emailSentAt: new Date(),
                    emailError: null,
                },
            }
        );

        return res.status(200).json({
            success: true,
            emailId: emailResponse.id,
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Error resending email:', error);

        // Optionally update the donation with error info
        if (req.body.donationId) {
            try {
                const client = await clientPromise;
                const db = client.db('Fotia_db');
                await db.collection('donations').updateOne(
                    { _id: new ObjectId(req.body.donationId) },
                    {
                        $set: {
                            emailSent: false,
                            emailError: error.message,
                        },
                    }
                );
            } catch (dbError) {
                console.error('Error updating donation:', dbError);
            }
        }

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}