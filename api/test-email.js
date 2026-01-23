import { sendEmail } from './utils/skrybe.js';
import { MonthlyPartnerEmail, OneTimeDonorEmail } from './emails';
import { render } from '@react-email/render';

const TEST_EMAIL_ADDRESS = 'fotianetwork@gmail.com'; // Replace with a real test email address

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
        // Send One-Time Donor Email
        const oneTimeEmailHtml = render(
            <OneTimeDonorEmail
                donorName="Test Donor"
                amount={5000}
            />
        );

        await sendEmail({
            to: TEST_EMAIL_ADDRESS,
            subject: 'Test - Thank You for Your One-Time Gift!',
            html: oneTimeEmailHtml,
            fromName: 'Fotia Network',
            fromEmail: 'admin@fotianetwork.org',
            replyTo: 'fotianetwork@gmail.com'
        });

        // Send Monthly Partner Email
        const monthlyEmailHtml = render(
            <MonthlyPartnerEmail
                donorName="Test Partner"
                amount={10000}
                paystackLink="https://paystack.shop/pay/fotiamonthly"
                isCustomAmount={false}
            />
        );

        await sendEmail({
            to: TEST_EMAIL_ADDRESS,
            subject: 'Test - Welcome to the Partner Family!',
            html: monthlyEmailHtml,
            fromName: 'Fotia Network',
            fromEmail: 'admin@fotianetwork.org',
            replyTo: 'fotianetwork@gmail.com'
        });

        return res.status(200).json({ success: true, message: 'Test emails sent successfully!' });

    } catch (error) {
        console.error('Error sending test emails:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
