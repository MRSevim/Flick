import { Emailer } from "@/components/Emailer/Emailer";
import { envVariables } from "@/utils/HelperFuncs";
import { sendEmailCall } from "@/utils/ApiCalls/EmailApiFunctions";

export const metadata = {
  title: "Emailer",
  description: "Emailer page of " + envVariables.websiteName,
};

const page = async ({ searchParams }) => {
  const email = searchParams.email;
  const type = searchParams.type;

  if (email) {
    const { error, successMessage } = await sendEmailCall(email, type);

    return (
      <Emailer
        emailProp={email}
        typeProp={type}
        stateProp={{ error, successMessage }}
      />
    );
  }

  return <Emailer />;
};

export default page;
