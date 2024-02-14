import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./Contexts/UserContext";
import { useSignup } from "./Hooks/UserHooks/UseSignup";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user] = useUserContext();
  const { signup, isLoading, error, setError } = useSignup();

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
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
      <form className="" onSubmit={handleSubmit}>
        <div className="form-group ">
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
            E-mail:
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="form-control form-control-lg wide-input"
              type="email"
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
        <div className="form-group">
          <label>
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
          className="btn btn-warning mt-3"
          type="submit"
          value="Sign-up"
        />
        {error && (
          <div className="text-center mt-3 wide-input alert alert-danger">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
