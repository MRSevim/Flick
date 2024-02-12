import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "./Contexts/UserContext";
import { useLogin } from "./Hooks/UseLogin";

export const Login = ({ onHideModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useUserContext();
  const { login, error, isLoading } = useLogin();

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/");
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await login(username, password);

    if (response.ok) {
      if (onHideModal) {
        onHideModal();
      }
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center">
        <form className="" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Username:
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="form-control form-control-lg wide-input"
                type="text"
                required
              />
            </label>
          </div>
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
            className="btn btn-warning mt-3"
            type="submit"
            value="Login"
          />
          {error && (
            <div className="text-center mt-3 wide-input alert alert-danger">
              {error}
            </div>
          )}
        </form>
      </div>
    </>
  );
};
