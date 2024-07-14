import { Emailer } from "@/components/Emailer/Emailer";
import { envVariables } from "@/utils/HelperFuncs";

export const metadata = {
  title: "Emailer",
  description: "Emailer page of " + envVariables.websiteName,
};

const page = () => {
  return <Emailer />;
};

export default page;
