import React from "react";

interface XpClaimEmailProps {
  totalXp: number;
  claimUrl: string;
}

export const XpClaimEmail = ({ totalXp, claimUrl }: XpClaimEmailProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Claim your {totalXp.toLocaleString()} XP - Superoptimised</title>
      </head>
      <body style={main}>
        <div style={container}>
          <div style={logoContainer}>
            <h2 style={{ textAlign: "center", color: "#64748b", margin: "0 0 32px 0" }}>
              Superoptimised
            </h2>
          </div>
          
          <h1 style={h1}>🏆 Your XP is Ready to Claim!</h1>
          
          <p style={heroText}>
            Thanks for being part of the Superoptimised community! You've earned{" "}
            <strong>{totalXp.toLocaleString()} XP</strong> through your participation 
            in community voting and engagement.
          </p>

          <div style={xpContainer}>
            <div style={xpAmount}>{totalXp.toLocaleString()} XP</div>
            <div style={xpLabel}>Total Earned</div>
          </div>

          <div style={buttonContainer}>
            <a href={claimUrl} style={button}>
              Claim Your XP
            </a>
          </div>

          <p style={text}>
            This secure link will expire in 24 hours for your security. Click the button 
            above to complete your XP claim and see your contribution to the community.
          </p>

          <div style={footerSection}>
            <p style={footerText}>
              Your privacy matters to us. This email is sent only for XP claiming and 
              your data is never shared or linked to your anonymous votes.
            </p>
            
            <p style={footerText}>
              Questions? Reply to this email or reach out on{" "}
              <a href="https://x.com/superoptimised" style={link}>
                X (@superoptimised)
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default XpClaimEmail;

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 20px 48px",
  maxWidth: "560px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1a202c",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const heroText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const xpContainer = {
  background: "linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(100, 116, 139, 0.05))",
  borderRadius: "8px",
  padding: "32px",
  textAlign: "center" as const,
  margin: "32px 0",
};

const xpAmount = {
  color: "#64748b",
  fontSize: "48px",
  fontWeight: "bold",
  fontFamily: "Monaco, Menlo, 'Lucida Console', monospace",
  margin: "0",
  lineHeight: "1",
};

const xpLabel = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "8px 0 0 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const buttonContainer = {
  background: "#f9fafb",
  borderRadius: "4px",
  margin: "16px 0 14px",
  textAlign: "center" as const,
  padding: "16px",
};

const button = {
  backgroundColor: "#64748b",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 32px",
  width: "100%",
};

const text = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const footerSection = {
  margin: "45px 0 0 0",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "16px 0",
};

const link = {
  color: "#64748b",
  textDecoration: "underline",
};