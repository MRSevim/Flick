import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
import { useSignup } from "../Hooks/UserHooks/UseSignup";
import links from "../Utils/Links";
import { addDarkBg } from "../Utils/HelperFuncs";
import { Popup } from "./Popup";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { SendVerificationEmailButton } from "./SendVerificationEmailButton";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user] = useUserContext();
  const { signup, isLoading, error, setError, successMessage } = useSignup();
  const [darkMode] = useDarkModeContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate(links.homepage);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    await signup(username, email, password);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <form
        className={
          "bg-primary p-5 wide-input w-90 border border-3 rounded " +
          addDarkBg(darkMode)
        }
        onSubmit={handleSubmit}
      >
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
            E-mail:
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="form-control form-control-lg"
              type="email"
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
        <div className="form-group">
          <label className="w-100">
            Confirm Password:
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="form-control form-control-lg wide-input"
              type="password"
              required
            />
          </label>
        </div>
        <input
          disabled={isLoading}
          className="btn  btn-secondary mt-3"
          type="submit"
          value="Sign-up"
        />
        <p className="text-center mt-3">
          Already have an account?
          <Link to={links.login}>
            <button type="button" className="btn btn-outline-light ms-2">
              Login
            </button>
          </Link>
        </p>
        {error && <Popup message={error} type="danger" />}
        {successMessage && (
          <>
            <Popup message={successMessage} type="success" />
            <SendVerificationEmailButton email={email} re={true} />
          </>
        )}
      </form>
    </div>
  );
};
