// src/app/api/send-notification/route.js
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('📧 Notification API called');
  
  try {
    const body = await request.json();
    const { name, address, phone, email, desiredAmount, condition } = body;

    console.log('📝 Sending notification for:', name);

    // Use the same SMTP config that works for send-reply
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD.replace(/\s+/g, ''),
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    const mailOptions = {
      from: `"NovaCore" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `📋 New Cash Offer - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: #4f46e5; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">📋 New Cash Offer Request</h2>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p><strong>${name}</strong> submitted a cash offer request.</p>
            
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>📍</strong> ${address}</p>
              <p style="margin: 5px 0;"><strong>💰</strong> $${desiredAmount}</p>
              <p style="margin: 5px 0;"><strong>📞</strong> ${phone}</p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/admin" 
                 style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
                 View in Admin Portal
              </a>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Notification sent! Message ID:', result.messageId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ Notification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}