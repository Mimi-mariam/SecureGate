"use server";

import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const from = process.env.EMAIL_FROM || "SecureGate <noreply@securegate.io>";

    const info = await transporter.sendMail({ from, to, subject, html });

    console.log(`Email sent successfully to ${to} via Nodemailer (messageId: ${info.messageId})`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email via Nodemailer:", error);
    return { success: false, error: String(error) };
  }
}
