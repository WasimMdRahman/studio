import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"ParkWise" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    // Check for missing credentials first
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD || process.env.EMAIL_SERVER_USER === 'YOUR_GMAIL_ADDRESS@gmail.com') {
      console.error('Email credentials are not configured in .env file.');
      return NextResponse.json(
        { message: 'Email service is not configured on the server. Email not sent.' },
        { status: 500 }
      );
    }
    
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      { message: `Failed to send email: ${error.message}` },
      { status: 500 }
    );
  }
}
