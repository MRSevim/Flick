import { envVariables } from "@/utils/HelperFuncs";
import { getArticleCall } from "@/utils/ApiCalls/GetterUtils";
import { Edit } from "@/components/Edit/Edit";

export async function generateMetadata({ params, searchParams }) {
  const isDraft = searchParams.isDraft === "true";
  const { json } = await getArticleCall(params.id, isDraft);

  return {
    title: "Edit article titled:" + json.title,
    description: "Edit article page of " + envVariables.websiteName,
  };
}

const page = async ({ params, searchParams }) => {
  const isDraft = searchParams.isDraft === "true";
  const { json } = await getArticleCall(params.id, isDraft);

  return <Edit json={json} isDraft={isDraft} />;
};

export default page;
