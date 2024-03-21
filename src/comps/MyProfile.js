import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./Contexts/UserContext";
import { useUpdateUser } from "./Hooks/UserHooks/UseUpdateUser";
import { useGetUser } from "./Hooks/UserHooks/UseGetUser";
import { Modal } from "bootstrap";
import { DeleteModal } from "./DeleteModal";
import { FollowButtons } from "./FollowButtons";

export const MyProfile = () => {
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialImage, setInitialImage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [followerNumber, setFollowerNumber] = useState(null);
  const [followingNumber, setFollowingNumber] = useState(null);
  const [user] = useUserContext();
  const { getUser, isLoading: getLoading } = useGetUser();
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

    const get = async () => {
      const { response, json } = await getUser();
      if (response.ok) {
        setInitialUsername(json.username);
        setInitialEmail(json.email);
        setInitialImage(json.image);
        setUsername(json.username);
        setEmail(json.email);
        setImage(json.image);
        setFollowerNumber(json.followerNumber);
        setFollowingNumber(json.followingNumber);
        const date = new Date(json.createdAt);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setMemberSince(formattedDate);
      }
    };
    get();
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

    let apiUsername, apiEmail, apiPassword, apiImage;
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
    if (image !== initialImage) {
      apiImage = image;
    }
    await update(apiUsername, apiEmail, apiPassword, apiImage);
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
        <div className="container mt-5">
          <div className="row d-flex justify-content-center align-items-start">
            <div className="col col-12 col-lg-3 d-flex flex-column align-items-center mb-2 me-3">
              <img
                src={image}
                alt="profile large"
                className="profile-img"
                referrerPolicy="no-referrer"
              />
              <p className="mt-5 text-center">
                You've been a member since {memberSince}
              </p>
              <div className="mt-4 d-flex justify-content-center">
                <FollowButtons
                  id={user?._id}
                  followerNumber={followerNumber}
                  followingNumber={followingNumber}
                />
              </div>
            </div>
            <form
              className="update-form col col-12 col-lg-9 p-0 d-flex flex-column"
              onSubmit={handleSubmit}
            >
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
                  Image URL:
                  <input
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                    }}
                    className="form-control form-control-lg wide-input"
                    type="url"
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
                  user?.isGoogleLogin ? "Google Users can't update" : "Submit"
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
          </div>
          <div className="d-flex justify-content-center">
            <button
              onClick={handleDeleteAccount}
              className="btn btn-danger wide-input"
            >
              Delete account
            </button>
          </div>
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
