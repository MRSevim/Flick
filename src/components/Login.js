import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
import { useLogin } from "../Hooks/UserHooks/UseLogin";
import { GoogleLogin } from "@react-oauth/google";
import classNames from "classnames";

export const Login = ({ onHideModal, children, type }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useUserContext();
  const { login, error, setError, isLoading } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/");
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await login(username, password, false, null);

    if (response.ok) {
      if (onHideModal) {
        onHideModal();
      }
    }
  };
  const handleGoogleLogin = async (credential) => {
    await login(null, null, true, credential);
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <form
          className={classNames({
            "bg-dark text-white p-5": true,
            "border border-3 rounded": type !== "modal",
          })}
          onSubmit={handleSubmit}
        >
          {children}
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
            className="btn btn-warning my-3"
            type="submit"
            value="Login"
          />
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                setError("Failed logging in with Google");
              }}
            />
          </div>
          <p className="text-center mt-3">
            Don't have an account?
            <Link to={"/sign-up"}>
              <button
                onClick={onHideModal}
                type="button"
                className="btn btn-outline-light ms-2"
              >
                Create one...
              </button>
            </Link>
          </p>
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
