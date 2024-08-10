import { Articles } from "@/components/Articles/Articles";
import { getArticlesCall } from "@/utils/ApiCalls/GetterUtils";
import { envVariables } from "@/utils/HelperFuncs";

export async function generateMetadata({ params, searchParams }) {
  const { json } = await getArticlesCall(params.id, searchParams.page, true);
  const username = json.user.username;

  return {
    title: "Drafts of " + username,
    description: "Drafts of " + username + " on " + envVariables.websiteName,
  };
}

const page = async ({ params, searchParams }) => {
  const advancedSearch = searchParams.advancedSearch === "true";
  const { json } = await getArticlesCall(
    params.id,
    searchParams.page,
    true,
    advancedSearch,
    searchParams.title,
    searchParams.tags
  );
  return <Articles isDraft={true} json={json} />;
};

export default page;
