import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'pledge2025';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('donations');

        const donationData = {
            ...req.body,
            createdAt: new Date(),
            status: 'pending',
            ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        };

        // Validate required fields
        if (!donationData.fullName || !donationData.email || !donationData.phone) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['fullName', 'email', 'phone']
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(donationData.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const result = await collection.insertOne(donationData);

        res.status(200).json({
            success: true,
            message: 'Donation received successfully',
            id: result.insertedId,
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to process donation',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}