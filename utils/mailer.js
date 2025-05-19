const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',    // e.g. smtp.gmail.com
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
