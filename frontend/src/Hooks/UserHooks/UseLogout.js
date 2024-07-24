import { useUserContext } from "../../Contexts/UserContext";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import userApi from "../../Utils/UserApiFunctions";
import { googleLogout } from "@react-oauth/google";

export const useLogout = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [, setUser] = useUserContext();

  const logout = async () => {
    setGlobalError(null);

    const response = await userApi.logout();
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    if (response.ok) {
      // remove from storage
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      googleLogout();

      // update the user context
      setUser(undefined);
    }

    return response;
  };

  return { logout };
};
