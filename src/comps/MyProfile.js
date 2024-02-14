import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./Contexts/UserContext";
import userApi from "./Utils/UserApiFunctions";
import { useUpdateUser } from "./Hooks/UserHooks/UseUpdateUser";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export const MyProfile = () => {
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [user] = useUserContext();
  const [getUserError, setGetUserError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { update, isLoading, error, setError } = useUpdateUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      navigate("/");
    }
    const getUser = async () => {
      const res = await userApi.getProfile();
      const json = await res.json();

      if (res.ok) {
        setInitialUsername(json.username);
        setInitialEmail(json.email);
        setUsername(json.username);
        setEmail(json.email);
        const date = new Date(json.createdAt);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setMemberSince(formattedDate);
        setFormVisible(true);
      } else {
        setGetUserError(json.message);
      }
    };
    getUser();
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    setSuccessMessage(null);
    e.preventDefault();

    let apiUsername, apiEmail, apiPassword;
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (password && password === confirmPassword) {
      apiPassword = password;
    }
    if (username !== initialUsername) {
      apiUsername = username;
    }
    if (email !== initialEmail) {
      apiEmail = email;
    }
    const res = await update(apiUsername, apiEmail, apiPassword);
    if (res.ok) {
      setSuccessMessage("Profile updated");
    }
  };

  const handleDeleteAccount = () => {};

  return (
    <>
      {getUserError && (
        <Alert
          className="position-absolute start-50 translate-middle"
          severity="error"
          onClose={() => {
            setGetUserError(null);
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {getUserError}
        </Alert>
      )}
      {formVisible ? (
        <div className="container mt-5 d-flex flex-column align-items-center">
          <form className="update-form" onSubmit={handleSubmit}>
            <h2>Update Profile</h2>
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
                />
              </label>
            </div>
            <input
              disabled={isLoading}
              className="btn btn-warning mt-3"
              type="submit"
              value="Submit"
            />
            {error && (
              <div className="text-center mt-3 wide-input alert alert-danger">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="text-center mt-3 wide-input alert alert-success">
                {successMessage}
              </div>
            )}
          </form>
          <p className="wide-input mt-5 text-center">
            You've been a member since {memberSince}
          </p>
          <button onClick={handleDeleteAccount} className="btn btn-danger">
            Delete account
          </button>
        </div>
      ) : (
        <div className="container mt-5 d-flex justify-content-center">
          <div className="lds-ring">
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};
