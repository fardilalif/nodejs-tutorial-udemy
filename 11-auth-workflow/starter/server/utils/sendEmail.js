const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig.js');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  transporter.sendMail({
    from: '"Fardil alif" <muhdfardilalif@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

module.exports = sendEmail;
