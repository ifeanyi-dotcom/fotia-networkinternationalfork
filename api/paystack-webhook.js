// api/paystack-webhook.js

import crypto from 'crypto';
import clientPromise from './utils/db.js'; // Assuming db.js exports a clientPromise
import { sendSkrybeEmail } from './utils/skrybe.js';
import { ObjectId } from 'mongodb'; // Import ObjectId for database operations

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Get from environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Verify Paystack signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      console.error('Invalid Paystack signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    // Step 2: Handle relevant events
    if (event === 'charge.success' || event === 'subscription.create') {
      const { reference, customer, amount } = data;

      if (!reference) {
        console.log('No reference in webhook, skipping');
        return res.status(200).json({ received: true });
      }

      // Step 3: Find donation by paymentReference
      const client = await clientPromise;
      const db = client.db('Fotia_db');
      const donationsCollection = db.collection('donations');

      const donation = await donationsCollection.findOne({
        paymentReference: reference,
        status: 'pending_payment'
      });

      if (!donation) {
        console.log(`No pending donation found for reference: ${reference}`);
        return res.status(200).json({ received: true });
      }

      // Step 4: Update donation status to active
      await donationsCollection.updateOne(
        { _id: donation._id },
        {
          $set: {
            status: 'active',
            paystackCustomerId: customer?.customer_code || null,
            paymentVerifiedAt: new Date(),
            // Assuming amount in webhook data is in kobo, convert to naira for comparison/storage if needed
            // For now, using the amount already stored in our db, as the webhook event just confirms payment
            // amount: (amount / 100).toString(), // Uncomment if you want to update amount from webhook
          }
        }
      );

      // Step 5: Send welcome email via Skrybe
      try {
        const emailResponse = await sendSkrybeEmail({
          to: donation.email,
          templateType: 'monthly_welcome',
          data: {
            name: donation.fullName.split(' ')[0], // First name only
            amount: parseFloat(donation.amount.replace(/,/g, '')).toLocaleString() // Formatted amount
          }
        });

        await donationsCollection.updateOne(
          { _id: donation._id },
          {
            $set: {
              welcomeEmailSent: true,
              welcomeEmailSentAt: new Date(),
              emailId: emailResponse.id || null,
            }
          }
        );
        console.log('Monthly welcome email sent successfully via Skrybe:', emailResponse);

      } catch (emailError) {
        console.error('Failed to send monthly welcome email:', emailError);
        // Don't fail the webhook, just log the error and update status
        await donationsCollection.updateOne(
            { _id: donation._id },
            { $set: { emailError: emailError.message, welcomeEmailSent: false } }
        );
      }

      console.log(`Successfully processed payment for: ${donation.email} with reference ${reference}`);
    } else if (event === 'charge.failed' || event === 'subscription.not_renewing') {
      const { reference } = data;
      if (reference) {
        const client = await clientPromise;
        const db = client.db('Fotia_db');
        const donationsCollection = db.collection('donations');

        await donationsCollection.updateOne(
            { paymentReference: reference, status: 'pending_payment' },
            { $set: { status: 'payment_failed', paymentVerifiedAt: new Date() } }
        );
        console.log(`Payment failed for reference: ${reference}`);
      }
    }


    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Paystack retries for app errors
    // In a real-world scenario, you might want to log this error to a monitoring service
    return res.status(200).json({ received: true, error: error.message });
  }
}