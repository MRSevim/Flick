import React from "react";
import links from "../Utils/Links";
import { Link } from "react-router-dom";

export const SendVerificationEmailButton = ({ email = null, re }) => {
  return (
    <Link to={links.emailer(email, "send-verification-email")}>
      <button type="button" className="btn btn-secondary">
        {re ? "Resend" : "Send"} Verification Email
      </button>
    </Link>
  );
};
