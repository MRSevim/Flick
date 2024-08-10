import { useFormState, useFormStatus } from "react-dom";
import { useUserContext } from "@/contexts/UserContext";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg } from "@/utils/HelperFuncs";
import { deleteAccountCall } from "@/utils/ApiCalls/UserApiFunctions";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import links from "@/utils/Links";
import { logoutCall } from "@/utils/ApiCalls/UserApiFunctionsOnClient";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";

export const DeleteModal = ({ children, refProp }) => {
  const [user, setUser] = useUserContext();
  const [successMessage, setSuccessMessage] = useState(null);
  const [darkMode] = useDarkModeContext();
  const router = useRouter();
  const pathname = usePathname();
  const [, setGlobalError] = useGlobalErrorContext();

  const handleDeleteUser = async (prevState, formData) => {
    const { error } = await deleteAccountCall(formData);
    if (error) {
      return error;
    }

    const logoutError = await logoutCall(pathname, router);
    if (logoutError) {
      setGlobalError(logoutError);
      return;
    }
    setUser(undefined);

    refProp.current.hide();
    router.push(links.homepage);
  };
  const [error, formAction] = useFormState(handleDeleteUser, "");

  return (
    <div className=" d-flex justify-content-center">
      <form
        className={"bg-primary m-5 w-90 wide-input " + addDarkBg(darkMode)}
        action={formAction}
      >
        {children}
        <div className="form-group">
          <label className="w-100">
            Password:
            <input
              name="password"
              className="form-control form-control-lg"
              type="password"
              required={!user?.isGoogleLogin}
            />
          </label>
        </div>
        <p className="my-2">
          {user?.isGoogleLogin && "Leave the field empty and hit Delete"}
        </p>
        <div className="text-center alert alert-danger">
          Please note that all of your articles, comments and likes are also
          going to be deleted...
        </div>
        <SubmitButton />
        {successMessage && (
          <div className="text-center mt-3 alert alert-success">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="text-center mt-3 alert alert-danger">{error}</div>
        )}
      </form>
    </div>
  );
};
export const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <input
      disabled={pending}
      className="btn btn-danger"
      type="submit"
      value="Delete"
    />
  );
};
