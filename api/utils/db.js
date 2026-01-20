/* global process */
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'Fotia_db'; // Assuming user has set this in their .env

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set.');
    }

    const client = await MongoClient.connect(uri);

    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;

    return { client, db };
}
