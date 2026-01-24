// api/utils/skrybe.js

const SKRYBE_API_KEY = process.env.SKRYBE_API_KEY;
const SKRYBE_API_URL = 'https://dashboard.skry.be/api/emails/send-transactional.php';

export async function sendSkrybeEmail({ to, templateType, data }) {
    if (!SKRYBE_API_KEY) {
        throw new Error('SKRYBE_API_KEY environment variable is not set.');
    }

    // Format amount display - handle both numeric and N/A values
    const amountDisplay = data.amount && data.amount !== 'N/A'
        ? `₦${parseFloat(data.amount).toLocaleString()}`
        : 'your generous gift';

    const templates = {
        onetime_thankyou: {
            subject: `Thank You, ${data.name}! Your gift is making an impact 🔥`,
            body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; }
            .header h1 { color: #fff; font-size: 24px; margin: 0; }
            .content { padding: 30px; }
            .amount-box { background: #fff3cd; border-left: 4px solid #ff6b35; padding: 15px; margin: 20px 0; }
            .amount-box strong { font-size: 18px; color: #ff6b35; }
            .cta-button { display: inline-block; background: #ff6b35; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
            .logo-footer { max-width: 120px; margin: 15px auto 10px; display: block; }
          </style>
        </head>
        <body>
            <img src="https://partner.fotianetwork.org/logo.png" alt="Fotia Network Logo" class="logo-footer">
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>Thank you so much for your generous gift of <strong>${amountDisplay}</strong> to Fotiá Network to fuel prayer, evangelism, and revival gatherings across the nations!</p>
              <p>Your partnership means the world to us, and we're honored that you've chosen to invest in the work God is doing through Fotia. Because of you, we're able to reach more people with the Gospel.</p>

              <h3>Would you consider partnering with us monthly?</h3>
              <p>Would you like to make an even greater impact? Consider joining our community of monthly partners who are consistently fueling the fire of ministry.</p>
              <a href="https://paystack.shop/pay/fotiamonthly" class="cta-button">Become a Monthly Partner →</a>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p>We're praying for you and grateful for your heart for the Kingdom.</p>
              <p>With love,<br>Evang. Emeka Ezera,<br><strong>Fotia Network</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 Fotiá Network International. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        },
        monthly_welcome: {
            subject: `Thank you for partnering monthly, ${data.name}`,
            body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; }
            .header h1 { color: #fff; font-size: 24px; margin: 0; }
            .content { padding: 30px; }
            .cta-button { display: inline-block; background: #ff6b35; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
            .logo-footer { max-width: 120px; margin: 15px auto 10px; display: block; }
          </style>
        </head>
        <body>
            <img src="https://partner.fotianetwork.org/logo.png" alt="Fotia Network Logo" class="logo-footer">
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>We are so excited that you've committed to partnering with us monthly with your gift of <strong>${amountDisplay}/month</strong> toward Fotia Network to fuel prayer, evangelism, and revival gatherings across the nations. Your faithfulness enables us to reach more people with the Gospel.</p>

              <h3>What to Expect as a Partner:</h3>
              <ul>
                <li>Monthly impact updates and stories from the ministry</li>
                <li>A reminder email before each monthly donation</li>
                <li>Our heartfelt prayers and gratitude</li>
              </ul>

              <p>You'll receive a reminder a few days before your next automated donation.</p>

              <p>Thank you for saying "yes" to this journey with us. We're honored to have you on our team.</p>
              <p>With love,<br>Evang. Emeka Ezera,<br><strong>Fotia Network</strong></p>
             
            </div>
            <div class="footer">
              <p>© 2026 Fotiá Network International. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
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
        from_email: 'noreply@fotianetwork.org',
        reply_to: 'fotianetwork@gmail.com',
        subject: template.subject,
        html_body: template.body,
        is_html: true
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
    } catch {
        // If parsing fails and it wasn't a success message, throw error
        if (!responseText.toLowerCase().includes('success')){
            throw new Error(`Skrybe API error: ${responseText}`);
        }
        // if it was a success message but not json, just return it
        return { status: 'success', message: responseText };
    }
}