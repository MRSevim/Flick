import { envVariables } from "@/utils/HelperFuncs";
import { getFollowsCall } from "@/utils/ApiCalls/GetterUtils";
import { Follows } from "@/components/User/Follows";

export async function generateMetadata({ params, searchParams }) {
  const { json } = await getFollowsCall(
    params.id,
    "followers",
    searchParams.page
  );

  return {
    title: "Followers page of " + json.username,
    description:
      "Followers page of " + json.username + " on " + envVariables.websiteName,
  };
}

const page = async ({ params, searchParams }) => {
  const { json } = await getFollowsCall(
    params.id,
    "followers",
    searchParams.page
  );
  return <Follows json={json} type="followers" />;
};

export default page;
