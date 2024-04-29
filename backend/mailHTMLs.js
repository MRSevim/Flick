const htmls = {
  verificationHTML: (username, href) => {
    return `<h1>Verification Email</h1>
        <p>Hi ${username},</p>
        <p>You just need to verify your email address before you can use Flick Articles.</p>
        <a  href="${href}">
        <button style="
          cursor:pointer;
          background-color: #00a9a5; 
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          border-radius: 4px">
        Verify your email address 
        </button>
        </a>
  
        <p>Thanks! – The Flick Articles</p>`;
  },
};
module.exports = htmls;
