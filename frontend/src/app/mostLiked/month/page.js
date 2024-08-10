import { envVariables } from "@/utils/HelperFuncs";
import { getMostLikedCall } from "@/utils/ApiCalls/GetterUtils";
import { MostLiked } from "@/components/MostLiked/MostLiked";

export const metadata = {
  title: "Most liked articles this month",
  description: "Most liked articles this month on" + envVariables.websiteName,
};

const page = async () => {
  const { json } = await getMostLikedCall("month");
  return <MostLiked json={json} time="month" />;
};

export default page;
