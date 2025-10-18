// src/app/api/send-reply/route.js
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('📧 Send-reply API called');
  
  try {
    const body = await request.json();
    const { to, subject, message, customerName } = body;

    console.log('Request data:', { to, subject, customerName });

    // Validate required fields
    if (!to || !subject || !message) {
      console.error('Missing fields:', { to, subject, message });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? 'Set' : 'Not set',
      password: process.env.SMTP_PASSWORD ? 'Set' : 'Not set'
    });

    // Remove spaces from app password if they exist
    const cleanPassword = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : '';

    const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // ← MUST be true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: cleanPassword,
  },
  tls: {
    rejectUnauthorized: false
  }
});
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    const mailOptions = {
      from: `"NovaCore" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
            <h1>NovaCore Property Solutions</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hello ${customerName},</h2>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>Thank you for your interest in NovaCore.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Best regards,</strong><br>NovaCore Team</p>
              <p>Phone: (216) 667-7884</p>
            </div>
          </div>
        </div>
      `,
      text: `Hello ${customerName},\n\n${message}\n\nBest regards,\nNovaCore Team\nPhone: (216) 667-7884`,
    };

    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent! Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ API Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Email failed: ${error.message}`,
        code: error.code
      },
      { status: 500 }
    );
  }
}