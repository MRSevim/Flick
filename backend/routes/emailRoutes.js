const express = require("express");
const {
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/emailController");

const router = express.Router();

router.put("/verify/:token", verifyEmail);

router.post("/resend-verification-email", resendVerificationEmail);

module.exports = router;
