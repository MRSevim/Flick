const htmls = require("./mailHTMLs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const generateToken = (res, userId, rememberMe) => {
  let token;
  let cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "none",
  };
  if (process.env.NODE_ENV !== "development") {
    cookieOptions.domain = process.env.DOMAIN_BASE;
  }
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
const sendEmail = async (type, email, username, next, info) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let subject, html;
  if (type === "email-verification") {
    subject = "Verify your email adress";
    html = htmls.verificationHTML(username, info.token, email);
  } else if (type === "verified") {
    subject = "Account verified";
    html = htmls.verifiedHTML(username);
  } else if (type === "password-reset") {
    subject = "Password reset";
    html = htmls.passwordReset(username, info.password);
  } else if (type === "ban-user") {
    subject = "Your account has been banned";
    html = htmls.banned(username, info.reasonOfBan);
  }
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.WEBSITE_NAME}" <${process.env.EMAIL}>`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      html, // html body
    });
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
