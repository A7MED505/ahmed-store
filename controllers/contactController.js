// controllers/contactController.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// GET /contact
exports.getContact = (req, res) => {
  res.render('contact', { success: null, error: null });
};

// POST /contact
exports.postContact = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVE_EMAIL,
      subject: `New message from ${name}`,
      html: `
        <p><strong>Sender:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });
    res.render('contact', { success: 'Message sent successfully', error: null });
  } catch (err) {
    console.error('Error sending contact email:', err);
    res.render('contact', { success: null, error: 'An error occurred while sending the message' });
  }
};
