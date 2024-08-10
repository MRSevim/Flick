import { NotFound } from "@/components/NotFound/NotFound";
import { envVariables } from "@/utils/HelperFuncs";

export const metadata = {
  title: "Page is not found",
  description: "Not found page of " + envVariables.websiteName,
};

export default function page() {
  return <NotFound />;
}
