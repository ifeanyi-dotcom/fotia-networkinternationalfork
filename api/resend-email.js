import { Resend } from 'resend';
import clientPromise from './utils/db';
import { ObjectId } from 'mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
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
        const db = client.db();
        const donations = db.collection('donations');

        // Find the donation
        const donation = await donations.findOne({ _id: new ObjectId(donationId) });

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        // Determine email template based on donation type
        const isMonthly = donation.donationType === 'monthly';

        const emailSubject = isMonthly
            ? 'Thank You for Becoming a Monthly Partner!'
            : 'Thank You for Your Generous Donation!';

        const emailHtml = isMonthly
            ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Thank You, ${donation.name}!</h1>
          <p>We are thrilled to welcome you as a Monthly Partner.</p>
          <p>Your monthly commitment of <strong>$${donation.amount}</strong> will make a lasting impact.</p>
          <p>As a monthly partner, you'll receive:</p>
          <ul>
            <li>Regular updates on our mission</li>
            <li>Exclusive partner newsletters</li>
            <li>Early access to events</li>
          </ul>
          <p>Thank you for your continued support!</p>
          <p>With gratitude,<br>The Team</p>
        </div>
      `
            : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Thank You, ${donation.name}!</h1>
          <p>We are deeply grateful for your generous donation of <strong>$${donation.amount}</strong>.</p>
          <p>Your contribution will help us continue our important work and make a real difference.</p>
          <p>A receipt for your donation has been attached for your records.</p>
          <p>Thank you for your support!</p>
          <p>With gratitude,<br>The Team</p>
        </div>
      `;

        // Send email via Resend
        const emailResponse = await resend.emails.send({
            from: 'Fotia Network <partners@fotianetwork.org',
            to: [donation.email],
            subject: emailSubject,
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
                const db = client.db();
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
