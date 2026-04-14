import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Donation submission route
app.post('/api/donations', async (req, res) => {
    try {
        const { default: handler } = await import('./api/donations.js');
        await handler(req, res);
    } catch (error) {
        console.error('Error loading or executing donations handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get donations route
app.get('/api/get-donations', async (req, res) => {
    try {
        const { default: handler } = await import('./api/get-donations.js');
        await handler(req, res);
    } catch (error) {
        console.error('Error loading or executing get-donations handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Subscribe BURN route
app.post('/api/subscribe-burn', async (req, res) => {
    try {
        const { default: handler } = await import('./api/subscribe-burn.js');
        await handler(req, res);
    } catch (error) {
        console.error('Error loading or executing subscribe-burn handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Resend email route
app.post('/api/resend-email', async (req, res) => {
    try {
        const { default: handler } = await import('./api/resend-email.js');
        await handler(req, res);
    } catch (error) {
        console.error('Error loading or executing resend-email handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Test email route
app.post('/api/test-email', async (req, res) => {
    try {
        const { default: handler } = await import('./api/test-email.js');
        await handler(req, res);
    } catch (error) {
        console.error('Error loading or executing test-email handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
