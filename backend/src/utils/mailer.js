import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. "smtp.gmail.com"
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,     // your SMTP user
    pass: process.env.SMTP_PASS      // your SMTP pass or app password
  }
});

/**
 * Send a generic email.
 * @param {string} to      Recipient email
 * @param {string} subject Email subject
 * @param {string} html    HTML body
 */
export async function sendEmail({ to, subject, html }) {
  if (!to) throw new Error('No recipient specified');
  const info = await transporter.sendMail({
    from: `"GovBuy Notifications" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
  console.log('Email sent:', info.messageId);
  return info;
}
