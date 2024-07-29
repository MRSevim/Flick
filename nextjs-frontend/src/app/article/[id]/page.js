import { Article } from "@/components/Article/Article";
import { getArticleCall, getSimilarCall } from "@/utils/ApiCalls/GetterUtils";
import { extractExcerptFromHTML } from "@/utils/HelperFuncs";

export async function generateMetadata({ params }) {
  const { json } = await getArticleCall(params.id, false);

  return {
    title: json.title,
    description: extractExcerptFromHTML(json.content),
    keywords: json.tags.join(","),
  };
}

const page = async ({ params }) => {
  const { json } = await getArticleCall(params.id, false);
  const { similar, error } = await getSimilarCall(params.id);

  return <Article json={json} similar={similar} error={error} />;
};

export default page;
