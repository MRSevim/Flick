import { getFeaturedCall } from "@/utils/ApiCalls/GetterUtils";
import { Featured } from "./Featured";

export const FeaturedParent = async () => {
  const { json, error } = await getFeaturedCall();
  return <Featured json={json} error={error} />;
};
