require("dotenv").config({ path: "./.env" });

const envVariables = {
  env: process.env.ENV,
  encryptionKey: process.env.ENCRYPTION_KEY,
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  redisUri: process.env.REDIS_URI,
  jwtSecret: process.env.JWT_SECRET,
  email: process.env.EMAIL,
  emailClientId: process.env.EMAIL_CLIENT_ID,
  emailClientSecret: process.env.EMAIL_CLIENT_SECRET,
  emailRefreshToken: process.env.EMAIL_REFRESH_TOKEN,
  websiteName: process.env.WEBSITE_NAME,
  googleId: process.env.GOOGLE_CLIENT_ID,
  frontendUrl: process.env.FRONTEND_URL,
  defaultUserImage: process.env.DEFAULT_USER_IMAGE,
  defaultArticleImage: process.env.DEFAULT_ARTICLE_IMAGE,
};

module.exports = envVariables;
