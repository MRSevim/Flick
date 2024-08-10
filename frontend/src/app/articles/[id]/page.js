import { Articles } from "@/components/Articles/Articles";
import { getArticlesCall } from "@/utils/ApiCalls/GetterUtils";
import { envVariables } from "@/utils/HelperFuncs";

export async function generateMetadata({ params, searchParams }) {
  const { json } = await getArticlesCall(params.id, searchParams.page, false);
  const username = json.user.username;

  return {
    title: "Articles of " + username,
    description: "Articles of " + username + " on " + envVariables.websiteName,
  };
}

const page = async ({ params, searchParams }) => {
  const advancedSearch = searchParams.advancedSearch === "true";
  const { json } = await getArticlesCall(
    params.id,
    searchParams.page,
    false,
    advancedSearch,
    searchParams.title,
    searchParams.tags
  );
  return <Articles isDraft={false} json={json} />;
};

export default page;
