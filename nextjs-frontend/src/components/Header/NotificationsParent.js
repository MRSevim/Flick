import { getNotificationsCall } from "@/utils/ApiCalls/GetterUtils";

import { Notifications } from "./Notifications";

export const NotificationsParent = async () => {
  const { json, error } = await getNotificationsCall();

  return <Notifications json={json} error={error} />;
};
