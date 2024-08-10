import { envVariables } from "@/utils/HelperFuncs";
const backendUrl = envVariables.backendUrl;

export async function GET() {
  const res = await fetch(backendUrl);
  const data = await res.json();
  console.log(data);
}
