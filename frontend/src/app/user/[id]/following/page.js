import { envVariables } from "@/utils/HelperFuncs";
import { getFollowsCall } from "@/utils/ApiCalls/GetterUtils";
import { Follows } from "@/components/User/Follows";

export async function generateMetadata({ params, searchParams }) {
  const { json } = await getFollowsCall(
    params.id,
    "following",
    searchParams.page
  );

  return {
    title: "Following page of " + json.username,
    description:
      "Following page of " + json.username + " on " + envVariables.websiteName,
  };
}

const page = async ({ params, searchParams }) => {
  const { json } = await getFollowsCall(
    params.id,
    "following",
    searchParams.page
  );
  return <Follows json={json} type="following" />;
};

export default page;
