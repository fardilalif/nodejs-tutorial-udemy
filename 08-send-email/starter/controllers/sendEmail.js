const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendEmailEthereal = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'josiah.spencer@ethereal.email',
      pass: 'rSjqcFyq6jnnAaza2U',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fardil Alif" <muhdfardilalif@gmail.com>',
    to: 'muhdfardil66@gmail.com',
    subject: 'hello fardil',
    html: '<h2>Sending email with node js</h2>',
  });

  res.json({ info, success: true });
};

const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'muhdfardil66@gmail.com', // Change to your recipient
    from: 'muhdfardilalif@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  const info = await sgMail.send(msg);

  // response is sent for testing purposes
  res.json({ info });
};

module.exports = sendEmailEthereal;
