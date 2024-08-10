import { Search } from "@/components/Search/Search";
import {
  searchAdvancedCall,
  searchAllCall,
} from "@/utils/ApiCalls/SearchApiFunctions";
import { envVariables } from "@/utils/HelperFuncs";

export async function generateMetadata({ searchParams }) {
  const advancedSearch = searchParams.advancedSearch === "true";
  if (advancedSearch) {
    return {
      title: "Advanced search results",
      description: "Advanced search results on " + envVariables.websiteName,
    };
  }
  return {
    title: "Search results for " + searchParams.q,
    description:
      "Search results for " +
      searchParams.q +
      " on " +
      envVariables.websiteName,
  };
}

const page = async ({ searchParams }) => {
  const advancedSearch = searchParams.advancedSearch === "true";
  if (advancedSearch) {
    const json = await searchAdvancedCall(
      searchParams.username,
      searchParams.title,
      searchParams.tags
    );
    return <Search json={json} />;
  } else {
    const { json } = await searchAllCall(searchParams.q, true);
    return <Search json={json} />;
  }
};

export default page;
