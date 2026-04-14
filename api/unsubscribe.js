import dotenv from 'dotenv';

dotenv.config();

const SKRYBE_API_KEY = process.env.SKRYBE_API_KEY;
const SKRYBE_API_URL = 'https://dashboard.skry.be/unsubscribe';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // We allow both GET (for the direct link) and POST
    const { email, list } = req.method === 'POST' ? req.body : req.query;

    if (!email || !list) {
        return res.status(400).json({ error: 'Missing email or list ID' });
    }

    if (!SKRYBE_API_KEY) {
        console.error('SKRYBE_API_KEY not configured');
        return res.status(500).json({ error: 'Email service not configured' });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('api_key', SKRYBE_API_KEY);
        formData.append('email', email);
        formData.append('list', list);
        formData.append('boolean', 'true');

        const response = await fetch(SKRYBE_API_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const responseText = await response.text();
        console.log('Skrybe unsubscribe response:', responseText);

        if (responseText.toLowerCase().includes('success') || responseText.trim() === '1') {
            return res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
        } else {
            return res.status(400).json({ success: false, message: responseText || 'Failed to unsubscribe' });
        }
    } catch (error) {
        console.error('Error in unsubscribe handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
