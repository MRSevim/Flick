const envVariables = require("./envVariables");

const htmls = {
  verificationHTML: (username, token, email) => {
    return `<h1>Verification Email</h1>
        <p>Hi ${username},</p>
        <p>You can verify your email address through the button below.</p>
        <a style="text-decoration: none; "  href="${
          envVariables.frontendUrl + "/token/" + token
        }">
        <button style="
          cursor:pointer;
          background-color: #01BEAD; 
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
          envVariables.frontendUrl +
          "/emailer?email=" +
          email +
          "&type=send-verification-email"
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
  
        <p>Best regards! – ${envVariables.websiteName}</p>`;
  },
  verifiedHTML: (username) => {
    return `<h1>Account verified</h1>
        <p>Hi ${username},</p>
        <p>This email account has been verified.</p>
        <p>Best regards! – ${envVariables.websiteName}</p>`;
  },
  passwordReset: (username, password) => {
    return `<h1>Password Reset</h1>
        <p>Hi ${username},</p>
        <p>Your password has been reset. Your new password is:</p>
        <p>${password}</p>
        <p>Best regards! – ${envVariables.websiteName}</p>`;
  },
  banned: (username, reason) => {
    return `<h1>You are banned</h1>
        <p>Hi ${username},</p>
        <p>You are banned from using ${envVariables.websiteName}. Reason for ban:</p>
        <p>${reason}</p>
        <p>Best regards! – ${envVariables.websiteName}</p>`;
  },
};
module.exports = htmls;
