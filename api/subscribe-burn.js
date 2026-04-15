import clientPromise from './utils/db.js';
import { ObjectId } from 'mongodb';

const SKRYBE_API_KEY = process.env.SKRYBE_API_KEY;
const SKRYBE_API_URL = 'https://dashboard.skry.be/subscribe';
const BURN_LIST_ID = '6DHGp892nK6616b892f4lFcG763A';

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>&;"'()]/g, '')
        .substring(0, 100);
};

const validateLettersOnly = (value) => {
    return /^[a-zA-Z\s'-]+$/.test(value.trim());
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const validatePhone = (phone) => {
    return /^[0-9]{10,}$/.test(phone.replace(/[^\d]/g, ''));
};

const sanitizePhone = (phone) => {
    return phone.replace(/[^\d]/g, '');
};

export default async function handler(req, res) {
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
        const {
            first_name,
            last_name,
            email,
            phone,
            city,
            first_timer,
            consent
        } = req.body;

        const errors = [];

        if (!first_name || !first_name.trim()) {
            errors.push('First name is required');
        } else if (!validateLettersOnly(first_name)) {
            errors.push('First name must contain only letters');
        }

        if (!last_name || !last_name.trim()) {
            errors.push('Last name is required');
        } else if (!validateLettersOnly(last_name)) {
            errors.push('Last name must contain only letters');
        }

        if (!email || !email.trim()) {
            errors.push('Email is required');
        } else if (!validateEmail(email)) {
            errors.push('Email must be valid');
        }

        if (!phone || !phone.trim()) {
            errors.push('Phone is required');
        } else if (!validatePhone(phone)) {
            errors.push('Phone must contain at least 10 digits');
        }

        if (!city || !['Abuja', 'Lagos', 'Jos'].includes(city)) {
            errors.push('Please select a valid city');
        }

        if (!consent) {
            errors.push('You must consent to receive emails');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors.join('. ') + '.'
            });
        }

        if (!SKRYBE_API_KEY) {
            console.error('SKRYBE_API_KEY not configured');
            return res.status(500).json({
                success: false,
                message: 'Email service not configured'
            });
        }

        const sanitizedFirstName = sanitizeInput(first_name);
        const sanitizedLastName = sanitizeInput(last_name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPhone = sanitizePhone(phone);
        const fullName = `${sanitizedFirstName} ${sanitizedLastName}`;

        const cityMap = {
            'Abuja': 'abuja',
            'Lagos': 'lagos',
            'Jos': 'jos'
        };

        // Construct Dynamic Tags for Skrybe Dashboard Visibility
        const tagList = ['BURN 2026'];
        tagList.push(`City: ${city}`);
        tagList.push(first_timer ? 'Attendee: New' : 'Attendee: Returning');
        const tagString = tagList.join(',');

        const formData = new URLSearchParams();
        formData.append('api_key', SKRYBE_API_KEY);
        formData.append('name', fullName);
        formData.append('email', sanitizedEmail);
        formData.append('list', BURN_LIST_ID);
        formData.append('first_name', sanitizedFirstName);
        formData.append('last_name', sanitizedLastName);
        formData.append('phone', sanitizedPhone);
        formData.append('city', cityMap[city]);
        formData.append('first_timer', first_timer ? 'true' : 'false');
        formData.append('tags', tagString); // High-visibility tagging
        formData.append('gdpr', 'true');
        formData.append('boolean', 'true');
        formData.append('silent', 'true');

        let skrybeResponse = null;
        let skrybeSuccess = false;
        let skrybeError = null;

        try {
            const skrybeRequest = await fetch(SKRYBE_API_URL, {
                method: 'POST',
                body: formData
            });

            skrybeResponse = await skrybeRequest.text();

            if (skrybeResponse.toLowerCase().includes('success') || skrybeResponse.trim() === '1') {
                skrybeSuccess = true;
            } else if (skrybeResponse.toLowerCase().includes('already subscribed')) {
                skrybeError = 'This email is already registered for BURN';
                return res.status(400).json({
                    success: false,
                    message: skrybeError
                });
            } else if (skrybeResponse.toLowerCase().includes('bounced')) {
                skrybeError = 'This email address has bounced. Please use a valid email.';
                return res.status(400).json({
                    success: false,
                    message: skrybeError
                });
            } else if (skrybeResponse.toLowerCase().includes('suppressed')) {
                skrybeError = 'This email address is suppressed. Please contact support.';
                return res.status(400).json({
                    success: false,
                    message: skrybeError
                });
            } else if (skrybeResponse.toLowerCase().includes('invalid email')) {
                skrybeError = 'The email address is invalid';
                return res.status(400).json({
                    success: false,
                    message: skrybeError
                });
            } else {
                skrybeError = 'Failed to subscribe. Please try again.';
                console.error('Skrybe API unexpected response:', skrybeResponse);
                return res.status(400).json({
                    success: false,
                    message: skrybeError
                });
            }
        } catch (skrybeErr) {
            console.error('Skrybe API error:', skrybeErr);
            return res.status(500).json({
                success: false,
                message: 'Email service error. Please try again later.'
            });
        }

        const client = await clientPromise;
        const db = client.db('Fotia_db');
        const burnCollection = db.collection('burn_subscribers');

        const subscriberRecord = {
            first_name: sanitizedFirstName,
            last_name: sanitizedLastName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            city: city,
            first_timer: first_timer === true || first_timer === 'true',
            tags: tagString,
            consent: true,
            createdAt: new Date(),
            ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
            skrybeResponseStatus: skrybeSuccess ? 'success' : 'error',
            skrybeErrorMessage: skrybeError || null
        };

        const result = await burnCollection.insertOne(subscriberRecord);

        // Send custom branded welcome email via Skrybe Transactional API
        try {
            const { sendSkrybeEmail } = await import('./utils/skrybe.js');
            await sendSkrybeEmail({
                to: sanitizedEmail,
                templateType: 'burn_welcome',
                data: {
                    name: fullName,
                    city: city
                }
            });
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // We don't return error here because the registration was successful
        }

        return res.status(201).json({
            success: true,
            message: 'Your registration for BURN was successful! Check your email for details.',
            subscriberId: result.insertedId
        });

    } catch (error) {
        console.error('Error processing BURN subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
