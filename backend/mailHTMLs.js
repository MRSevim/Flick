const htmls = {
  verificationHTML: (username, token, email) => {
    return `<h1>Verification Email</h1>
        <p>Hi ${username},</p>
        <p>You just need to verify your email address before you can use Flick Articles.</p>
        <a style="text-decoration: none;"  href="${
          process.env.FRONTEND_URL + "/login?token=" + token
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
  
        <p>Thanks! – The Flick Articles</p>`;
  },
};
module.exports = htmls;
