import clientPromise from './utils/db.js';
import { sendEmail } from './utils/skrybe.js';

// Simple HTML email templates
const generateOneTimeEmail = (donorName, amount) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #dc2626; padding: 30px 40px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">🔥 Fotia Network International</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Thank You, ${donorName}!</h2>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                We are deeply grateful for your generous one-time gift of <strong>₦${amount?.toLocaleString()}</strong> to Fotia Network International.
                            </p>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                Your gift is making a real difference! Through your generosity, we are able to:
                            </p>
                            
                            <ul style="padding-left: 20px; margin: 0 0 20px 0;">
                                <li style="color: #4b5563; font-size: 16px; line-height: 28px;">Spread the Gospel to unreached communities</li>
                                <li style="color: #4b5563; font-size: 16px; line-height: 28px;">Support outreach programs and events</li>
                                <li style="color: #4b5563; font-size: 16px; line-height: 28px;">Provide resources for spiritual growth</li>
                            </ul>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                May God bless you abundantly for your faithfulness and generosity!
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <!-- CTA Section -->
                            <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; text-align: center;">
                                <h3 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 15px 0;">Become a Monthly Partner</h3>
                                <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                    Want to make an even greater impact? Join our family of monthly partners who are consistently fueling the fire of ministry.
                                </p>
                                <a href="https://paystack.shop/pay/fotiamonthly" style="display: inline-block; background-color: #dc2626; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; padding: 14px 30px; margin-top: 10px;">
                                    Become a Monthly Partner →
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center;">
                            <p style="color: #6b7280; font-size: 14px; line-height: 24px; margin: 0 0 10px 0;">
                                With gratitude,<br />
                                <strong>Fotia Network International</strong>
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                © 2026 Fotia Network International. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

const generateMonthlyEmail = (donorName, amount, paystackLink, isCustomAmount) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #dc2626; padding: 30px 40px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">Fotia Network International</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Welcome to the Partner Family, ${donorName}!</h2>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                We are thrilled that you've decided to become a monthly partner with Fotia Network International with a commitment of <strong>₦${amount?.toLocaleString()}/month</strong>!
                            </p>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                Your consistent partnership is the fuel that keeps the fire burning. Together, we are making an eternal impact!
                            </p>
                            
                            <!-- Action Box -->
                            <div style="background-color: #fef3c7; padding: 30px; border-radius: 8px; text-align: center; margin: 25px 0;">
                                <h3 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 15px 0;">Complete Your Partnership Setup</h3>
                                <p style="color: #92400e; font-size: 15px; margin: 0 0 20px 0;">
                                    ${isCustomAmount
        ? `Click the button below and enter ₦${amount?.toLocaleString()} as your recurring monthly amount:`
        : 'Click the button below to set up your recurring monthly partnership:'
    }
                                </p>
                                <a href="${paystackLink}" style="display: inline-block; background-color: #dc2626; border-radius: 6px; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; text-align: center; padding: 16px 35px;">
                                    Set Up My Monthly Partnership →
                                </a>
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 20px 0;">
                                Thank you for standing with us. Your faithfulness is helping to spread the fire of the Gospel across nations!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center;">
                            <p style="color: #6b7280; font-size: 14px; line-height: 24px; margin: 0 0 10px 0;">
                                With gratitude and blessings,<br />
                                <strong>Fotia Network International</strong>
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                                Questions? Reply to this email or contact us at partners@fotianetwork.org
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                                © 2026 Fotia Network International. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

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
        const { fullName, email, phone, donationType, amount, prayerRequest } = req.body;

        // Validate required fields
        if (!fullName || !email || !donationType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('Fotia_db');
        const donations = db.collection('donations');

        // Parse amount - remove commas if present
        const parsedAmount = amount ? parseInt(amount.toString().replace(/,/g, '')) : 0;

        // Create donation record matching your database schema
        const donation = {
            fullName,
            email,
            phone,
            amount: amount || '', // Keep original format with commas
            prayerRequest: prayerRequest || '',
            donationType,
            createdAt: new Date(),
            status: 'pending',
            emailSent: false,
            ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
        };

        // Save to MongoDB
        const result = await donations.insertOne(donation);
        console.log('Donation saved:', result.insertedId);

        // Send confirmation email ONLY for one-time donors
        if (donationType === 'one-time') {
            try {
                const emailHtml = generateOneTimeEmail(
                    fullName.split(' ')[0], // First name only
                    parsedAmount
                );

                // Send email via Skrybe
                const emailResult = await sendEmail({
                    to: email,
                    subject: 'Thank You for Your Gift to Fotia Network!',
                    html: emailHtml,
                    fromName: 'Fotia Network',
                    fromEmail: 'admin@fotianetwork.org',
                    replyTo: 'fotianetwork@gmail.com'
                });

                console.log('Email sent successfully via Skrybe:', emailResult);

                // Update donation record to mark email as sent
                await donations.updateOne(
                    { _id: result.insertedId },
                    { $set: { emailSent: true, emailProvider: 'skrybe', emailSentAt: new Date() } }
                );

            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Update donation to mark email as failed
                await donations.updateOne(
                    { _id: result.insertedId },
                    { $set: { emailSent: false, emailError: emailError.message } }
                );
            }
        } else {
            // For monthly partners, just mark as email not applicable
            await donations.updateOne(
                { _id: result.insertedId },
                { $set: { emailSent: null } } // null = not applicable for monthly
            );
        }

        return res.status(201).json({
            message: 'Donation recorded successfully',
            donationId: result.insertedId
        });

    } catch (error) {
        console.error('Error processing donation:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}