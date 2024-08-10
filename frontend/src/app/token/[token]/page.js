import { EmailVerification } from "@/components/EmailVerification/EmailVerification";
import { envVariables } from "@/utils/HelperFuncs";

export const metadata = {
  title: "Verifying your email...",
  description: "Email verification page of " + envVariables.websiteName,
};
const page = ({ params }) => {
  const token = params.token;
  return <EmailVerification token={token} />;
};

export default page;
