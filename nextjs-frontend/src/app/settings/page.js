import { Settings } from "@/components/Settings/Settings";
import { getProfileCall } from "@/utils/ApiCalls/GetterUtils";
import { envVariables } from "@/utils/HelperFuncs";

export async function generateMetadata() {
  const { json } = await getProfileCall();

  return {
    title: "User settings page of " + json.username,
    description:
      "User settings page of " +
      json.username +
      " on " +
      envVariables.websiteName,
  };
}

const page = async () => {
  const { json } = await getProfileCall();
  return <Settings json={json} />;
};

export default page;
