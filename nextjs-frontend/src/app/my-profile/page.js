import { MyProfile } from "@/components/MyProfile/MyProfile";
import { envVariables } from "@/utils/HelperFuncs";
import { getProfileCall } from "@/utils/ApiCalls/GetterUtils";

export const metadata = {
  title: "My Profile",
  description: "Personal profile page of " + envVariables.websiteName,
};
const page = async () => {
  const { json } = await getProfileCall();

  return <MyProfile json={json} />;
};

export default page;
