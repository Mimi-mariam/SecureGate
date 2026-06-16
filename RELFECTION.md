Securegate - Reflection and Engineering Analysis
Mariam Abdulrasheed
Design to MVP Bootcamp
Live URL: https://securegate-lovat.vercel.app/
GitHub Repo: https://github.com/Mimi-mariam/SecureGate.git
What I Built

SecureGate is a standalone authentication system built with Next.js, TypeScript, Prisma, and PostgreSQL. It includes user registration, login, email verification, password reset, protected routes, logout functionality, and password hashing with bcrypt.
I also implemented rate limiting for security, session management with NextAuth, and transactional emails using Nodemailer. The goal was to build a secure and production-ready authentication system.
 What Surprised Me
 Part 2 — What Surprised Me

One thing that was harder than I expected was setting up email sending with Resend. It didn’t work on Vercel because of the domain setup issue, so I kept getting errors. I had to switch everything and use Nodemailer instead, and also reconfigure the email flow again. It taught me that tools don’t always plug in smoothly, and sometimes you have to change your setup and adjust quickly.

Q1 — Murphy's Law
Code reference:** `src/app/api/auth/[...nextauth]/route.ts` lines 34-48
This part handles login and session creation, so I added checks for wrong credentials and rate limiting. I also made sure errors are handled properly without exposing sensitive info.
What goes wrong if ignored: If this is ignored, attackers can brute force passwords, crash the login flow with repeated requests, or get too much info from error messages, which can lead to account compromise.

 How This Changes How I Build
 Before this project, I thought authentication was just login and signup working. But now I understand there is a lot more behind it like session handling, token security, rate limiting, and email verification.
I also learned that security is not something you add later, it has to be built in from the start. Things like error messages, password hashing, and token expiry really matter.
