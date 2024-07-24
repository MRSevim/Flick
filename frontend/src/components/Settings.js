import { Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetUser } from "../Hooks/UserHooks/UseGetUser";
import { LoadingRing } from "./LoadingRing";
import userApi from "../Utils/UserApiFunctions";

export const Settings = () => {
  const { getUser, isLoading } = useGetUser();
  const [newNotificationsDisabled, setNewNotificationsDisabled] =
    useState(null);
  const [newPmsDisabled, setNewPmsDisabled] = useState(null);
  useEffect(() => {
    const get = async () => {
      const { response, json } = await getUser();
      if (response.ok) {
        setNewNotificationsDisabled(json.newNotificationsDisabled);
        setNewPmsDisabled(json.newPmsDisabled);
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleNotificationToggle = async () => {
    const response = await userApi.toggleUserVariables("notification");
    if (response.ok) {
      setNewNotificationsDisabled(!newNotificationsDisabled);
    }
  };
  const handlePmToggle = async () => {
    const response = await userApi.toggleUserVariables("pm");
    if (response.ok) {
      setNewPmsDisabled(!newPmsDisabled);
    }
  };
  return (
    <div className="container">
      {isLoading && <LoadingRing />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center">
            <Switch
              checked={newNotificationsDisabled}
              onChange={handleNotificationToggle}
              inputProps={{ "aria-label": "controlled" }}
            />
            <div>Disable new notifications</div>
          </div>
          <div className="d-flex align-items-center">
            <Switch
              checked={newPmsDisabled}
              onChange={handlePmToggle}
              inputProps={{ "aria-label": "controlled" }}
            />
            <div>Disable new pms</div>
          </div>
        </>
      )}
    </div>
  );
};
