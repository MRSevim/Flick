/* put all your get requests here, doing it like this does not expose api endpoint,
if you need to use get on client comp, create new file? */
import "server-only";
import { notFound } from "next/navigation";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

export const getProfileCall = async () => {
  const response = await fetch(backendUrl + "/user/profile");
  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
