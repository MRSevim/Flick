import React, { useState } from "react";
import { useDeleteUser } from "../Hooks/UserHooks/UseDeleteUser";
import { useUserContext } from "../Contexts/UserContext";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg } from "../Utils/HelperFuncs";

export const DeleteModal = ({ children }) => {
  const [password, setPassword] = useState("");
  const [user] = useUserContext();
  const { deleteUser, isLoading, error, successMessage } = useDeleteUser();
  const [darkMode] = useDarkModeContext();
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (user.isGoogleLogin) {
      await deleteUser(null);
    } else {
      await deleteUser(password);
    }
  };

  return (
    <div className=" d-flex justify-content-center">
      <form
        className={"bg-primary m-5 w-90 wide-input " + addDarkBg(darkMode)}
        onSubmit={handleDeleteAccount}
      >
        {children}
        <div className="form-group">
          <label className="w-100">
            Password:
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
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
        <input
          disabled={isLoading}
          className="btn btn-danger"
          type="submit"
          value="Delete"
        />
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
