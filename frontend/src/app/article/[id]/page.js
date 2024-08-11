import { Article } from "@/components/Article/Article";
import { getArticleCall, getSimilarCall } from "@/utils/ApiCalls/GetterUtils";
import { extractExcerptFromHTML, redirectToImages } from "@/utils/HelperFuncs";
import { envVariables } from "@/utils/HelperFuncs";
import links from "@/utils/Links";

export async function generateMetadata({ params }) {
  const { json } = await getArticleCall(params.id, false);
  const title = json.title;
  const description = extractExcerptFromHTML(json.content);
  const rawImage = json.image;
  const image =
    rawImage === envVariables.defaultArticleImage
      ? redirectToImages(rawImage)
      : rawImage;

  return {
    metadataBase: new URL(envVariables.frontendUrl),
    title,
    description,
    keywords: json.tags.join(","),
    openGraph: {
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: envVariables.frontendUrl + links.article(params.id),
    },
  };
}

const page = async ({ params }) => {
  const { json } = await getArticleCall(params.id, false);
  const { similar, error } = await getSimilarCall(params.id);

  return <Article json={json} similar={similar} error={error} />;
};

export default page;
