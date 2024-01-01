const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'emie.hodkiewicz5@ethereal.email',
      pass: 'JYevuAf87hcG1zVVTG'
  }
});

const sendMail = async (to, subject, html) => {
  let mailOptions = {
    from: '"Sender Name" <sender@email.com>', // Update sender if needed
    to,
    subject,
    html,
  };

  let response = await transporter.sendMail(mailOptions);
  return response;
};

module.exports = sendMail;
