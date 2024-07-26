import { envVariables } from "@/utils/HelperFuncs";
import { getMostLikedCall } from "@/utils/ApiCalls/GetterUtils";
import { MostLiked } from "@/components/MostLiked/MostLiked";

export const metadata = {
  title: "Most liked articles this year",
  description: "Most liked articles this year on" + envVariables.websiteName,
};

const page = async () => {
  const { json } = await getMostLikedCall("year");
  return <MostLiked json={json} time="year" />;
};

export default page;
