import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./Contexts/UserContext";
import { useUpdateUser } from "./Hooks/UserHooks/UseUpdateUser";
import { useGetUser } from "./Hooks/UserHooks/UseGetUser";
import { Modal } from "bootstrap";
import { DeleteModal } from "./DeleteModal";

export const MyProfile = () => {
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [user] = useUserContext();
  const { _getUser, isLoading: getLoading } = useGetUser();
  const { update, isLoading, successMessage, error, setError } =
    useUpdateUser();
  const myModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      myModalRef?.current?.hide();
      navigate("/");
      return;
    }

    const getUser = async () => {
      const userData = await _getUser();
      setInitialUsername(userData.username);
      setInitialEmail(userData.email);
      setUsername(userData.username);
      setEmail(userData.email);
      const date = new Date(userData.createdAt);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setMemberSince(formattedDate);
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user]);

  useEffect(() => {
    myModalRef.current = new Modal(document.getElementById("deleteModal"), {
      backdrop: true,
      focus: true,
      keyboard: true,
    });
  }, []);

  const handleSubmit = async (e) => {
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
    await update(apiUsername, apiEmail, apiPassword);
  };

  const handleDeleteAccount = async () => {
    myModalRef.current.show();
  };

  return (
    <>
      {getLoading ? (
        <div className="container mt-5 d-flex justify-content-center">
          <div className="lds-ring">
            <div></div>
          </div>
        </div>
      ) : (
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
              disabled={isLoading || user?.isGoogleLogin}
              className="btn btn-warning mt-3"
              type="submit"
              value={
                user?.isGoogleLogin
                  ? "You cannot update with google login"
                  : "Submit"
              }
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
      )}
      <div className="modal fade" tabIndex="-1" id="deleteModal">
        <div className="modal-dialog d-flex justify-content-center">
          <div className="modal-content mt-5" style={{ width: "354px" }}>
            <DeleteModal>
              <button
                type="button"
                className="btn-close bg-light position-absolute top-0 start-0 m-1"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </DeleteModal>
          </div>
        </div>
      </div>
    </>
  );
};
