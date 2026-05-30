import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
} from '@react-email/components';

interface ResetPasswordEmailTemplateProps {
  firstName: string;
  resetLink: string;
  organizationName?: string;
}

export const ResetPasswordEmailTemplate = ({
  firstName,
  resetLink,
  organizationName = 'Our Platform',
}: ResetPasswordEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Preheader/Top links area */}
          <Section style={topLinksSection}>
            <Text style={topLinkLeft}>{organizationName}: Password Reset</Text>
          </Section>

          {/* Hero Section */}
          <Section style={heroSection}>
            <Heading style={heroText}>Reset your password 🔐</Heading>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={bodyText}>Hi {firstName},</Text>
            <Text style={bodyText}>
              We received a request to reset the password for your{' '}
              <strong>{organizationName}</strong> account. Click the button
              below to set up a new password:
            </Text>

            <Section style={btnContainer}>
              <Button style={button} href={resetLink}>
                Reset Password
              </Button>
            </Section>

            <Text style={bodyText}>
              This link will expire in 15 minutes. If you didn't request a
              password reset, you can safely ignore this email.
            </Text>

            <Hr style={hr} />

            {/* Footer Logo area */}
            <Section style={footerLogoSection}>
              <Text style={footerLogoText}>{organizationName}</Text>
              <Text style={footerSlogan}>A Modern Learning Company</Text>
            </Section>

            {/* Footer Text */}
            <Text style={footerTextCentered}>
              Copyright © {new Date().getFullYear()} {organizationName}, Inc.,
              all rights reserved.
            </Text>

            <Text style={footerText}>
              You are receiving this email because you requested a password
              reset for your account on {organizationName}.
            </Text>

            <Text style={footerText}>
              Our mailing address is:
              <br />
              <br />
              {organizationName}, Inc.
              <br />
              123 Education Avenue
              <br />
              Learning City, ED 10000
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#5b8ee0',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '12px 0',
};

const container = {
  backgroundColor: '#FFFFFF',
  margin: '0 auto',
  maxWidth: '600px',
};

const topLinksSection = {
  padding: '12px 40px 0',
};

const topLinkLeft = {
  color: '#212121',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'left' as const,
};

const heroSection = {
  backgroundColor: '#e6e6f4',
  margin: '6px 12px',
  padding: '80px 20px',
  textAlign: 'center' as const,
};

const heroText = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: '900',
  margin: '0',
  fontFamily: 'Georgia, serif',
  letterSpacing: '-0.5px',
};

const contentSection = {
  padding: '10px 40px 40px',
};

const bodyText = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '26px',
  fontFamily: 'Georgia, serif',
  margin: '0 0 20px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#212121',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
};

const hr = {
  borderColor: '#E5E5E5',
  margin: '24px 0',
};

const footerLogoSection = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const footerLogoText = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  letterSpacing: '-1px',
};

const footerSlogan = {
  color: '#767676',
  fontSize: '14px',
  margin: '0',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
};

const footerTextCentered = {
  color: '#767676',
  fontSize: '12px',
  lineHeight: '18px',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#212121',
  fontSize: '12px',
  lineHeight: '18px',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  margin: '0 0 24px 0',
  textAlign: 'left' as const,
};
