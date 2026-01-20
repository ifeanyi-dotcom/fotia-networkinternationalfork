import { connectToDatabase } from './utils/db.js';

export default async function handler(req, res) {
    // Enable CORS - (Same as donations.js)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); // Only GET and OPTIONS needed for this endpoint
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' // Added Authorization header
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    // Basic Authentication Check
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
        return res.status(401).json({error: 'Authorization required'});
    }

    const [authType, authValue] = authHeader.split(' ');
    if (authType !== 'Basic' || !authValue) {
        return res.status(401).json({error: 'Invalid authorization format'});
    }

    const decodedAuth = Buffer.from(authValue, 'base64').toString('utf8');
    const [username, password] = decodedAuth.split(':');

    // For simplicity, hardcoding admin credentials for local dev
    // In production, use environment variables for username/password or a more robust auth system
    if (username !== 'admin' || password !== 'fotia2024') {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    try {
        const {db} = await connectToDatabase();
        const collection = db.collection('donations');

        const {donationType, page = 1, limit = 10, search} = req.query;
        let query = {};

        if (donationType && (donationType === 'one-time' || donationType === 'monthly')) {
            query.donationType = donationType;
        }

        // Add search query
        if (search) {
            query.fullName = {$regex: search, $options: 'i'}; // Changed from fullName to match your schema
        }

        const totalDonations = await collection.countDocuments(query);
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const donations = await collection
            .find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        res.status(200).json({donations, totalDonations});
    } catch (error) {
        console.error('Database error in get-donations:', error);
        res.status(500).json({
            error: 'Failed to fetch donations',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
