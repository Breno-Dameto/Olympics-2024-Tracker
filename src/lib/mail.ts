// src/lib/mail.ts
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    let info = await transporter.sendMail({
      from: `"Olympics Updates" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });
  
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  };