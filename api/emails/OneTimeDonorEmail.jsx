import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from '@react-email/components';
import * as React from 'react';

export const OneTimeDonorEmail = ({ donorName, amount }) => (
    <Html>
        <Head />
        <Preview>Thank you for your generous gift to Fotia Network! 🔥</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={h1}>🔥 Fotia Network International</Heading>
                </Section>

                <Section style={content}>
                    <Heading style={h2}>Thank You, {donorName}!</Heading>

                    <Text style={text}>
                        We are deeply grateful for your generous one-time gift of <strong>₦{amount?.toLocaleString()}</strong> to Fotia Network International.
                    </Text>

                    <Text style={text}>
                        Your gift is making a real difference! Through your generosity, we are able to:
                    </Text>

                    <ul style={list}>
                        <li style={listItem}>Spread the Gospel to unreached communities</li>
                        <li style={listItem}>Support outreach programs and events</li>
                        <li style={listItem}>Provide resources for spiritual growth</li>
                    </ul>

                    <Text style={text}>
                        May God bless you abundantly for your faithfulness and generosity!
                    </Text>

                    <Hr style={hr} />

                    <Section style={ctaSection}>
                        <Heading style={h3}>Become a Monthly Partner</Heading>
                        <Text style={text}>
                            Want to make an even greater impact? Join our family of monthly partners who are consistently fueling the fire of ministry.
                        </Text>
                        <Button style={button} href="https://paystack.shop/pay/fotiamonthly">
                            Become a Monthly Partner →
                        </Button>
                    </Section>
                </Section>

                <Section style={footer}>
                    <Text style={footerText}>
                        With gratitude,<br />
                        <strong>Fotia Network International</strong>
                    </Text>
                    <Text style={footerSmall}>
                        © 2026 Fotia Network International. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default OneTimeDonorEmail;

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    maxWidth: '600px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const header = {
    backgroundColor: '#dc2626',
    padding: '30px 40px',
    textAlign: 'center',
};

const h1 = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const content = {
    padding: '40px',
};

const h2 = {
    color: '#1f2937',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
};

const h3 = {
    color: '#1f2937',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
};

const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 20px 0',
};

const list = {
    paddingLeft: '20px',
    margin: '0 0 20px 0',
};

const listItem = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '28px',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '30px 0',
};

const ctaSection = {
    backgroundColor: '#fef3c7',
    padding: '25px',
    borderRadius: '8px',
    textAlign: 'center',
};

const button = {
    backgroundColor: '#dc2626',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '14px 30px',
    marginTop: '10px',
};

const footer = {
    backgroundColor: '#f9fafb',
    padding: '30px 40px',
    textAlign: 'center',
};

const footerText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '0 0 10px 0',
};

const footerSmall = {
    color: '#9ca3af',
    fontSize: '12px',
    margin: '0',
};
