"use server";

import type { SendMailOptions } from 'nodemailer';

/**
 * Send an email using Nodemailer. The transporter is created lazily to avoid bundling
 * the `nodemailer` package (which depends on Node's `fs` module) into client code.
 */
export async function sendMail(options: SendMailOptions) {
  // Dynamically import nodemailer only on the server runtime
  const nodemailer = (await import('nodemailer')).default;

  // Ensure a default "from" address if not provided
  if (!options.from) {
    options.from = process.env.EMAIL_FROM || 'no-reply@example.com';
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail(options);
  console.log('Message sent: %s', info.messageId);
  return info;
}
