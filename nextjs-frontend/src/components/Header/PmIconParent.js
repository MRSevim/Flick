import { getReceivedLengthCall } from "@/utils/ApiCalls/GetterUtils";
import { PmIcon } from "./PmIcon";

export const PmIconParent = async () => {
  const { json, error } = await getReceivedLengthCall();
  return <PmIcon json={json} error={error} />;
};
