import React, { useState } from "react";
import { useDeleteUser } from "./Hooks/UserHooks/UseDeleteUser";

export const DeleteModal = () => {
  const [password, setPassword] = useState("");
  const { deleteUser, isLoading, successMessage } = useDeleteUser();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    await deleteUser(password);
  };

  return (
    <div className="container d-flex justify-content-center">
      <form className="" onSubmit={handleDeleteAccount}>
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
              required
            />
          </label>
        </div>
        <input
          disabled={isLoading}
          className="btn btn-danger mt-3"
          type="submit"
          value="Delete"
        />
        {successMessage && (
          <div className="text-center mt-3 wide-input alert alert-success">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};
