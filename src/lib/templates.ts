/**
 * Returns the HTML content for a verification email.
 */
export function getVerificationEmailHtml(token: string, name: string): string {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/verify?token=${token}`;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your SecureGate Account</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #0b0f19;
            color: #f3f4f6;
            padding: 40px 20px;
            text-align: center;
            border-radius: 12px;
            max-width: 600px;
            margin: 40px auto;
            border: 1px solid #1e293b;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          }
          h1 {
            color: #3b82f6;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: -0.025em;
          }
          p {
            font-size: 16px;
            color: #94a3b8;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 30px;
            transition: all 0.2s ease;
          }
          .verify-link {
            color: #3b82f6;
            font-size: 14px;
            word-break: break-all;
          }
          .footer {
            font-size: 12px;
            color: #475569;
            margin-top: 40px;
          }
          hr {
            border: 0;
            border-top: 1px solid #1e293b;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SecureGate</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" class="verify-button">Verify Email Address</a>
          <p>Or copy and paste this link in your browser:</p>
          <p class="verify-link">${verifyUrl}</p>
          <p>This link will expire in 15 minutes. If you did not create an account, you can safely ignore this email.</p>
          <hr>
          <div class="footer">
            &copy; ${new Date().getFullYear()} SecureGate. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPasswordResetEmailHtml(token: string): string {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your SecureGate Password</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #0b0f19;
            color: #f3f4f6;
            padding: 40px 20px;
            text-align: center;
            border-radius: 12px;
            max-width: 600px;
            margin: 40px auto;
            border: 1px solid #1e293b;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          }
          h1 {
            color: #3b82f6;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: -0.025em;
          }
          p {
            font-size: 16px;
            color: #94a3b8;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 30px;
          }
          .reset-link {
            color: #3b82f6;
            font-size: 14px;
            word-break: break-all;
          }
          .footer {
            font-size: 12px;
            color: #475569;
            margin-top: 40px;
          }
          hr {
            border: 0;
            border-top: 1px solid #1e293b;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SecureGate</h1>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to set a new password. This link will expire in 15 minutes.</p>
          <a href="${resetUrl}" class="reset-button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p class="reset-link">${resetUrl}</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <hr>
          <div class="footer">
            &copy; ${new Date().getFullYear()} SecureGate. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPasswordChangedEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your SecureGate Password Has Been Changed</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #0b0f19;
            color: #f3f4f6;
            padding: 40px 20px;
            text-align: center;
            border-radius: 12px;
            max-width: 600px;
            margin: 40px auto;
            border: 1px solid #1e293b;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          }
          h1 {
            color: #3b82f6;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: -0.025em;
          }
          p {
            font-size: 16px;
            color: #94a3b8;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          .footer {
            font-size: 12px;
            color: #475569;
            margin-top: 40px;
          }
          hr {
            border: 0;
            border-top: 1px solid #1e293b;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SecureGate</h1>
          <p>Your password has been changed successfully.</p>
          <p>If you made this change, no further action is needed.</p>
          <p>If you did <strong>not</strong> request this change, please secure your account immediately by contacting support.</p>
          <hr>
          <div class="footer">
            &copy; ${new Date().getFullYear()} SecureGate. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}
