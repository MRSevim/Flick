import { Login } from "@/components/Login/Login";
import { envVariables } from "@/utils/HelperFuncs";

export const metadata = {
  title: "Login",
  description: "Login page of " + envVariables.websiteName,
};

const page = () => {
  return <Login />;
};

export default page;
