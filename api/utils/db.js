/* global process */
import { MongoClient } from 'mongodb';
import dns from 'dns';

// Set a custom DNS resolver.
dns.setServers(['8.8.8.8']);


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

// Also export as default clientPromise for consistency
const clientPromise = (async () => {
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set.');
    }

    if (cachedClient) {
        return cachedClient;
    }

    const client = await MongoClient.connect(uri);
    cachedClient = client;
    return client;
})();

export default clientPromise;