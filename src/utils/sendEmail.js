import nodemailer from 'nodemailer';

import { SMTP_FROM_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME } from '../config/serverConfig.js';

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {
  // create reusable transporter object using the default SMTP transport
  try {
    let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Sometimes necessary for Gmail SMTP
      }
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: SMTP_FROM_EMAIL, // sender address
      to: email, // user email
      subject: subject, // Subject line
      html: message // html body
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email'); // Rethrow or handle as needed
  }
};

export default sendEmail;
