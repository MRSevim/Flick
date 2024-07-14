import { SignUp } from "@/components/Signup/Signup";
import { envVariables } from "@/utils/HelperFuncs";

export const metadata = {
  title: "Signup",
  description: "Signup page of " + envVariables.websiteName,
};

const page = () => {
  return <SignUp />;
};

export default page;
