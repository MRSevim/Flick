import React from "react";
import links from "../Utils/Links";
import { Link } from "react-router-dom";

export const ResendButton = ({ email = null }) => {
  return (
    <Link to={links.resendVerificationEmail(email)}>
      <button type="button" className="btn btn-secondary">
        Resend Verification Email
      </button>
    </Link>
  );
};
