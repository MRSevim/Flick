const express = require("express");
const {
  verifyEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../controllers/emailController");

const router = express.Router();

//verify email route
router.put("/verify/:token", verifyEmail);

//send verification email route
router.post("/send-verification-email", sendVerificationEmail);

//reset password route
router.post("/send-reset-password-email", sendResetPasswordEmail);

module.exports = router;
