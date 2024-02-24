import React, { useState } from "react";
import { useDeleteUser } from "./Hooks/UserHooks/UseDeleteUser";

export const DeleteModal = ({ children }) => {
  const [password, setPassword] = useState("");
  const { deleteUser, isLoading, error, successMessage } = useDeleteUser();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    await deleteUser(password);
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
        {error && (
          <div className="text-center mt-3 wide-input alert alert-danger">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
