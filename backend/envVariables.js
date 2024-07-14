require("dotenv").config({ path: "../.env" });

const envVariables = {
  env: process.env.REACT_APP_ENV,
  encryptionKey: process.env.ENCRYPTION_KEY,
  port: process.env.PORT,
  prerenderToken: process.env.PRERENDER_TOKEN,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  email: process.env.REACT_APP_EMAIL,
  emailClientId: process.env.EMAIL_CLIENT_ID,
  emailClientSecret: process.env.EMAIL_CLIENT_SECRET,
  emailRefreshToken: process.env.EMAIL_REFRESH_TOKEN,
  websiteName: process.env.REACT_APP_WEBSITE_NAME,
  googleId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  frontendUrl: process.env.FRONTEND_URL,
  defaultUserImage: process.env.REACT_APP_DEFAULT_USER_IMAGE,
  defaultArticleImage: process.env.REACT_APP_DEFAULT_ARTICLE_IMAGE,
};
module.exports = envVariables;
