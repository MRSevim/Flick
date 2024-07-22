import { User } from "@/components/User/User";
import { envVariables } from "@/utils/HelperFuncs";
import { getPublicUserCall } from "@/utils/ApiCalls/GetterUtils";

export async function generateMetadata({ params }) {
  const { json } = await getPublicUserCall(params.id);

  return {
    title: "User page of " + json.username,
    description:
      "User page of " + json.username + " on " + envVariables.websiteName,
  };
}

const page = async ({ params }) => {
  const { json } = await getPublicUserCall(params.id);
  return <User json={json} />;
};

export default page;
