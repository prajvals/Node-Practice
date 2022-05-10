const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'prajvaltheking@gmail.com',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
