import { Pms } from "@/components/Pms/Pms";
import { getPmsCall } from "@/utils/ApiCalls/GetterUtils";
import { envVariables } from "@/utils/HelperFuncs";

export async function generateMetadata() {
  return {
    title: "Pms",
    description: "Pms on " + envVariables.websiteName,
  };
}

const page = async ({ searchParams }) => {
  const { json } = await getPmsCall(searchParams.page, searchParams.type);
  return <Pms json={json} />;
};

export default page;
