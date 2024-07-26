// src/utils/emailService.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDailyGamesEmail = async (email: string, games: string[]) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Games for Today',
    text: `Today's games: ${games.join(', ')}`,
  };

  await transporter.sendMail(mailOptions);
};
