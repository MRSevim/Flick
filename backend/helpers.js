const htmls = require("./mailHTMLs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const envVariables = require("./envVariables");

const generateToken = (res, userId, rememberMe) => {
  let token;
  let cookieOptions = {
    httpOnly: true,
    secure: envVariables.env !== "development", // Use secure cookies in production
    sameSite: "strict",
  };
  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    token = jwt.sign({ userId }, envVariables.jwtSecret, {
      expiresIn: "30d",
    });
  } else {
    cookieOptions.expiresIn = 0;
    token = jwt.sign({ userId }, envVariables.jwtSecret);
  }

  res.cookie("jwt", token, cookieOptions);
  return token;
};
const generateVerificationToken = (userId) => {
  const token = jwt.sign({ userId }, envVariables.jwtSecret, {
    expiresIn: "5m",
  });
  return token;
};
const sendEmail = async (type, email, username, next, info) => {
  const client = new OAuth2Client(
    envVariables.emailClientId,
    envVariables.emailClientSecret
  );
  client.setCredentials({ refresh_token: envVariables.emailRefreshToken });
  const accessToken = client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: envVariables.email,
      clientId: envVariables.emailClientId,
      clientSecret: envVariables.emailClientSecret,
      refreshToken: envVariables.emailRefreshToken,
      accessToken,
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
      from: `"${envVariables.websiteName}" <${envVariables.email}>`, // sender address
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
  const CLIENT_ID_GOOGLE = envVariables.googleId;

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
