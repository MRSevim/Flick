import { envVariables } from "@/utils/HelperFuncs";
import { getMostLikedCall } from "@/utils/ApiCalls/GetterUtils";
import { MostLiked } from "@/components/MostLiked/MostLiked";

export const metadata = {
  title: "Most liked articles this week",
  description: "Most liked articles this week on" + envVariables.websiteName,
};

const page = async () => {
  const { json } = await getMostLikedCall("week");
  return <MostLiked json={json} time="week" />;
};

export default page;
