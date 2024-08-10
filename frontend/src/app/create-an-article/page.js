import dynamic from "next/dynamic";
const CreateAnArticle = dynamic(
  () =>
    import("@/components/CreateAnArticle/CreateAnArticle").then(
      (mod) => mod.CreateAnArticle
    ),
  {
    ssr: false,
  }
);
import { envVariables } from "@/utils/HelperFuncs";

export const metadata = {
  title: "Create an article",
  description: "Article creating page of " + envVariables.websiteName,
};

const page = () => {
  return <CreateAnArticle />;
};

export default page;
