import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
import { useLogin } from "../Hooks/UserHooks/UseLogin";
import { GoogleLogin } from "@react-oauth/google";
import classNames from "classnames";
import links from "../Utils/Links";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { Popup } from "./Popup";
import { SendVerificationEmailButton } from "./SendVerificationEmailButton";

export const Login = ({ onHideModal, children, type }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [user] = useUserContext();
  const { login, error, setError, isLoading } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode] = useDarkModeContext();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate(links.homepage);
    }
  });

  const hideModalIfExists = (response) => {
    if (response.ok && onHideModal) {
      onHideModal();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await login(username, password, false, null, rememberMe);

    hideModalIfExists(response);
  };
  const handleGoogleLogin = async (credential) => {
    const response = await login(null, null, true, credential, rememberMe);

    hideModalIfExists(response);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-center">
        <form
          className={classNames({
            "bg-primary p-5 wide-input w-90": true,
            "border border-3 rounded": type !== "modal",
            "bg-dark-primary": darkMode,
          })}
          onSubmit={handleSubmit}
        >
          {children}
          <div className="form-group">
            <label className="w-100">
              Username:
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="form-control form-control-lg"
                type="text"
                required
              />
            </label>
          </div>
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
                required
              />
            </label>
          </div>
          <input
            disabled={isLoading}
            className="btn btn-secondary my-3"
            type="submit"
            value="Login"
          />
          <div className="form-check mb-2">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={rememberMe}
                onChange={() => {
                  setRememberMe((prev) => !prev);
                }}
              />
              Remember me
            </label>
          </div>
          <p className="text-center">
            By logging in, you agree to our{" "}
            <Link
              to={links.tocAndPrivacyPolicy}
              className="unstyled-link hovered-link"
              target="_blank"
            >
              Terms of Conditions (ToC) and Privacy Policy
            </Link>
          </p>
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
            <Link to={links.signup()}>
              <button
                onClick={onHideModal}
                type="button"
                className="btn btn-outline-light ms-2"
              >
                Create one...
              </button>
            </Link>
          </p>
          <div className="text-center">
            <Link
              className="unstyled-link hovered-link"
              to={links.emailer(null, "send-reset-password-email")}
            >
              Forgot Password?
            </Link>
          </div>
          {error && (
            <>
              <Popup message={error} type="danger" />
              {error === "Please verify your account first" && (
                <SendVerificationEmailButton />
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};
