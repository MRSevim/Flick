"use client";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { useUserContext } from "@/contexts/UserContext";
import { toggleUserVariablesCall } from "@/utils/ApiCalls/UserApiFunctions";

export const Settings = ({ json }) => {
  const [user] = useUserContext();
  const [, setGlobalError] = useGlobalErrorContext();
  const newNotificationsDisabled = json.newNotificationsDisabled;
  const newPmsDisabled = json.newPmsDisabled;

  const handleAfter = (error) => {
    if (error) {
      setGlobalError(error);
    }
  };
  const handleNotificationToggle = async () => {
    const { error } = await toggleUserVariablesCall("notification", user._id);
    handleAfter(error);
  };
  const handlePmToggle = async () => {
    const { error } = await toggleUserVariablesCall("pm", user._id);
    handleAfter(error);
  };
  return (
    <div className="container">
      <div className="d-flex align-items-center">
        <label>
          <input
            className="form-check-input me-2"
            type="checkbox"
            checked={newNotificationsDisabled}
            onChange={handleNotificationToggle}
          />
          Disable new notifications
        </label>
      </div>
      <div className="d-flex align-items-center">
        <label>
          <input
            className="form-check-input me-2"
            type="checkbox"
            checked={newPmsDisabled}
            onChange={handlePmToggle}
          />
          Disable new pms
        </label>
      </div>
    </div>
  );
};
