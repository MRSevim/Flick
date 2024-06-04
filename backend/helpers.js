const htmls = require("./mailHTMLs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const generateToken = (res, userId, rememberMe) => {
  let token;
  let cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
  };
  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } else {
    cookieOptions.expiresIn = 0;
    token = jwt.sign({ userId }, process.env.JWT_SECRET);
  }

  res.cookie("jwt", token, cookieOptions);
  return token;
};
const generateVerificationToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  return token;
};
const sendEmail = async (type, email, username, token, next, password) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  let subject, html;
  if (type === "email-verification") {
    subject = "Verify your email adress";
    html = htmls.verificationHTML(username, token, email);
  } else if (type === "verified") {
    subject = "Account verified";
    html = htmls.verifiedHTML(username);
  } else if (type === "password-reset") {
    subject = "Password reset";
    html = htmls.passwordReset(username, password);
  }

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.WEBSITE_NAME}" <maddison53@ethereal.email>`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      html, // html body
    });
    console.log(nodemailer.getTestMessageUrl(info));
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {
    next(error);
  }
};

/**
 * @description Function to decode Google OAuth token
 * @param token: string
 * @returns ticket object
 */
const getDecodedOAuthJwtGoogle = async (token, next) => {
  const CLIENT_ID_GOOGLE = process.env.GOOGLE_CLIENT_ID;

  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    });

    return ticket;
  } catch (error) {
    next(error);
  }
};
module.exports = {
  generateToken,
  generateVerificationToken,
  sendEmail,
  getDecodedOAuthJwtGoogle,
};
