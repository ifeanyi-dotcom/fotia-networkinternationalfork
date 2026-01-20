/* global process */

export async function sendEmail({ to, subject, html, fromName = 'Fotia Network', fromEmail = 'fotianetwork@gmail.com', replyTo = 'fotianetwork@gmail.com' }) {
    const apiKey = process.env.SKRYBE_API_KEY;

    if (!apiKey) {
        throw new Error('SKRYBE_API_KEY environment variable is not set.');
    }

    const response = await fetch('https://dashboard.skry.be/api/send/transactional.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: apiKey,
            to_email: to,
            from_name: fromName,
            from_email: fromEmail,
            reply_to: replyTo,
            subject: subject,
            html_body: html,
            plain_body: html.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
        }),
    });

    const data = await response.json();

    if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to send email via Skrybe');
    }

    return data;
}

export default { sendEmail };