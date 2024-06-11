require("dotenv").config({ path: "../.env" });

const envVariables = {
  env: process.env.REACT_APP_ENV,
  encryptionKey: process.env.ENCRYPTION_KEY,
  port: process.env.PORT,
  mongoUrı: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  email: process.env.REACT_APP_EMAIL,
  emailPw: process.env.EMAIL_PASSWORD,
  websiteName: process.env.REACT_APP_WEBSITE_NAME,
  googleId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  appUrl: process.env.REACT_APP_URL,
};
module.exports = envVariables;
