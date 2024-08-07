import Link from "next/link";
import links from "@/utils/Links";

export const SendVerificationEmailButton = ({ email = null, re }) => {
  return (
    <Link
      target="_blank"
      href={links.emailer(email, "send-verification-email")}
    >
      <button type="button" className="btn btn-secondary">
        {re ? "Resend" : "Send"} Verification Email
      </button>
    </Link>
  );
};
