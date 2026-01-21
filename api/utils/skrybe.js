// api/utils/skrybe.js

const SKRYBE_API_KEY = process.env.SKRYBE_API_KEY;
const SKRYBE_API_URL = 'https://dashboard.skry.be/api/emails/send-transactional.php';

export async function sendSkrybeEmail({ to, templateType, data }) {
  if (!SKRYBE_API_KEY) {
    throw new Error('SKRYBE_API_KEY environment variable is not set.');
  }

  const templates = {
    onetime_thankyou: {
      subject: 'Thank You for Your Gift to Fotiá Network! 🔥',
      body: `
        Dear ${data.name},
        Thank you so much for your generous one-time gift of ₦${data.amount} to Fotiá Network!
        Your support helps us continue our mission and impact lives.

        Become a Monthly Partner
        Consider joining our community of monthly partners to make an even greater impact:
        [Link to Monthly Partnership Page]

        With gratitude,
        The Fotiá Network Team
      `
    },
    monthly_welcome: {
      subject: 'Welcome to the Fotiá Network Family! 🎉',
      body: `
        Dear ${data.name},
        Welcome to the Fotiá Network family! Your monthly partnership of ₦${data.amount} has been confirmed.
        As a monthly partner, you are making a lasting impact in the lives of many.
        We're honored to have you on this journey with us.

        With deep gratitude,
        The Fotiá Network Team
      `
    }
  };

  const template = templates[templateType];

  if (!template) {
    throw new Error(`Unknown email template type: ${templateType}`);
  }

  const payload = {
    api_key: SKRYBE_API_KEY,
    to_email: to,
    from_name: 'Fotiá Network',
    from_email: 'admin@fotianetwork.org',
    reply_to: 'fotianetwork@gmail.com',
    subject: template.subject,
    html_body: template.body
  };

  const response = await fetch(SKRYBE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Skrybe API error: ${responseText}`);
  }

  try {
    // Skrybe can return plain text "Success" or a JSON error
    if (responseText.toLowerCase().includes('success')) {
        return { status: 'success', message: responseText };
    }
    const jsonData = JSON.parse(responseText);
    if(jsonData.status !== 'success'){
        throw new Error(`Skrybe API error: ${responseText}`);
    }
    return jsonData;
  } catch (e) {
      // If parsing fails and it wasn't a success message, throw error
      if (!responseText.toLowerCase().includes('success')){
          throw new Error(`Skrybe API error: ${responseText}`);
      }
      // if it was a success message but not json, just return it
      return { status: 'success', message: responseText };
  }
}