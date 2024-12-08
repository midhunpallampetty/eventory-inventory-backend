import nodemailer from "nodemailer";

// Create a transporter to send emails using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider (e.g., Gmail, SES, etc.)
  auth: {
    user: "midhunpallampetty@gmail.com", // Replace with your email address
    pass: "acjr jvev anap xhag ", // Replace with your email password or an app-specific password
  },
});

interface SendLedgerEmailProps {
  customerEmail: string;
  customerName: string;
  ledgerDetails: string; // This could be a string or HTML format of the ledger
  
}

const sendLedgerEmail = async ({ customerEmail, customerName, ledgerDetails }: SendLedgerEmailProps): Promise<void> => {
  try {
    // Prepare the email content
    const mailOptions = {
      from: "your-email@example.com", // Replace with your email
      to: customerEmail, // Customer email
      subject: `Your Ledger Details - ${customerName}`,
      html: `
        <h2>Dear ${customerName},</h2>
        <p>Here are your latest ledger details:</p>
        <pre>${ledgerDetails}</pre>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards, <br/> Your Company</p>
        
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendLedgerEmail;
