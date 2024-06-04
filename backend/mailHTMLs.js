const htmls = {
  verificationHTML: (username, token, email) => {
    return `<h1>Verification Email</h1>
        <p>Hi ${username},</p>
        <p>You can verify your email address through the button below.</p>
        <a style="text-decoration: none;"  href="${
          process.env.FRONTEND_URL + "/" + token
        }">
        <button style="
          cursor:pointer;
          background-color: #00a9a5; 
          border: none;
          color: white;
          padding: 15px 32px;
          margin-right:14px;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          border-radius: 4px">
        Verify
        </button>
        </a>
        <a style="text-decoration: none;" href="${
          process.env.FRONTEND_URL + "/resend-verification-email?email=" + email
        }">
          <button style="
          cursor:pointer;
          background-color: #ffc107; 
          border: none;
          color: black;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          border-radius: 4px">
        Resend Verification Email
        </button>
        <a/>
  
        <p>Thanks! – ${process.env.WEBSITE_NAME}</p>`;
  },
  verifiedHTML: (username) => {
    return `<h1>Account verified</h1>
        <p>Hi ${username},</p>
        <p>This email account has been verified.</p>
        <p>Thanks! – ${process.env.WEBSITE_NAME}</p>`;
  },
  passwordReset: (username, password) => {
    return `<h1>Password Reset</h1>
        <p>Hi ${username},</p>
        <p>Your password has been reset. Your new password is:</p>
        <p>${password}</p>
        <p>Thanks! – ${process.env.WEBSITE_NAME}</p>`;
  },
};
module.exports = htmls;
