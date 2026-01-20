import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from '@react-email/components';
import * as React from 'react';

export const MonthlyPartnerEmail = ({
                                        donorName,
                                        amount,
                                        paystackLink,
                                        isCustomAmount
                                    }) => (
    <Html>
        <Head />
        <Preview>Welcome to the Fotia Network Partner Family!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={h1}>Fotia Network International</Heading>
                </Section>

                <Section style={content}>
                    <Heading style={h2}>Welcome to the Partner Family, {donorName}!</Heading>

                    <Text style={text}>
                        We are thrilled that you've decided to become a monthly partner with Fotia Network International with a commitment of <strong>₦{amount?.toLocaleString()}/month</strong>!
                    </Text>

                    <Text style={text}>
                        Your consistent partnership is the fuel that keeps the fire burning. Together, we are making an eternal impact!
                    </Text>

                    <Section style={actionBox}>
                        <Heading style={h3}>Complete Your Partnership Setup</Heading>
                        <Text style={actionText}>
                            {isCustomAmount
                                ? `Click the button below and enter ₦${amount?.toLocaleString()} as your recurring monthly amount:`
                                : 'Click the button below to set up your recurring monthly partnership:'
                            }
                        </Text>
                        <Button style={button} href={paystackLink}>
                            Set Up My Monthly Partnership →
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    <Text style={text}>
                        Thank you for standing with us. Your faithfulness is helping to spread the fire of the Gospel across nations!
                    </Text>
                </Section>

                <Section style={footer}>
                    <Text style={footerText}>
                        With gratitude and blessings,<br />
                        <strong>Fotia Network International</strong>
                    </Text>
                    <Text style={footerSmall}>
                        Questions? Reply to this email or contact us at partners@fotianetwork.org
                    </Text>
                    <Text style={footerSmall}>
                        © 2026 Fotia Network International. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default MonthlyPartnerEmail;

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
    paddingLeft: '0',
    margin: '0 0 25px 0',
    listStyle: 'none',
};

const listItem = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '32px',
};

const actionBox = {
    backgroundColor: '#fef3c7',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '25px 0',
};

const actionText = {
    color: '#92400e',
    fontSize: '15px',
    margin: '0 0 20px 0',
};

const button = {
    backgroundColor: '#dc2626',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '16px 35px',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '30px 0',
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
    margin: '5px 0',
};
