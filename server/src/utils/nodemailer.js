const nodemailer = require("nodemailer");
const ash = require("ash");

// Ethereal test account
const createTransporter = async () => {
  let testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendActivationEmail = async user => {
  const transporter = await createTransporter();
  return transporter.sendMail({
    from: '"MERN Verification" <noreply@mern.com>',
    to: user.email,
    subject: "Verify your email address.",
    text: `Hello ${(user.name || user.username).toTitleCase()},
      Go to the link to activate your account!
      ${process.env.CLIENT_URL}/auth/verify/${encodeURIComponent(user.activation.token)}`,
    html: `Hello <strong>${(user.name || user.username).toTitleCase()}</strong>,<br><br>
      Go to the link to activate your account!
      ${process.env.CLIENT_URL}/auth/verify/${encodeURIComponent(user.activation.token)}`,
  });
};

const sendSuccessEmail = async user => {
  const transporter = await createTransporter();
  return transporter.sendMail({
    from: '"MERN Verification" <noreply@mern.com>',
    to: user.email,
    subject: "Your account has been activated!",
    text: `Hello ${(user.name || user.username).toTitleCase()},
      Your account has been successfully activated!
      You may now login at ${process.env.CLIENT_URL}/auth/login/`,
    html: `Hello <strong>${(user.name || user.username).toTitleCase()}</strong>,<br><br>
      Your account has been successfully activated!
      You may now <a href="${process.env.CLIENT_URL}/auth/login/">login</a>`,
  });
};

module.exports = {
  sendActivationEmail,
  sendSuccessEmail,
};
