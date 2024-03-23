import React, { useState } from "react";
import { useDeleteUser } from "../Hooks/UserHooks/UseDeleteUser";
import { useUserContext } from "../Contexts/UserContext";

export const DeleteModal = ({ children }) => {
  const [password, setPassword] = useState("");
  const [user] = useUserContext();
  const { deleteUser, isLoading, error, successMessage } = useDeleteUser();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (user.isGoogleLogin) {
      await deleteUser(null);
    } else {
      await deleteUser(password);
    }
  };

  return (
    <div className="container d-flex justify-content-center text-white">
      <form
        className="bg-dark text-white p-4 border border-3 rounded"
        onSubmit={handleDeleteAccount}
      >
        {children}
        <div className="form-group">
          <label>
            Password:
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="form-control form-control-lg wide-input"
              type="password"
              required={!user?.isGoogleLogin}
            />
          </label>
        </div>
        <p className="my-2">
          {user?.isGoogleLogin && "Leave the field empty and hit Delete"}
        </p>
        <div className="text-center alert alert-danger">
          Please note that all of your articles and comments are also going to
          be deleted...
        </div>
        <input
          disabled={isLoading}
          className="btn btn-danger"
          type="submit"
          value="Delete"
        />
        {successMessage && (
          <div className="text-center mt-3 wide-input alert alert-success">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="text-center mt-3 wide-input alert alert-danger">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
