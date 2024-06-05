import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
import { useUpdateUser } from "../Hooks/UserHooks/UseUpdateUser";
import { useGetUser } from "../Hooks/UserHooks/UseGetUser";
import { DeleteModal } from "./DeleteModal";
import { FollowButtons } from "./FollowButtons";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";
import { ModalWrapper } from "./ModalWrapper";
import { Popup } from "./Popup";
import { SendVerificationEmailButton } from "./SendVerificationEmailButton";
import { RoleBanner } from "./RoleBanner";

export const MyProfile = () => {
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialImage, setInitialImage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [image, setImage] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [followerNumber, setFollowerNumber] = useState(null);
  const [followingNumber, setFollowingNumber] = useState(null);
  const [user] = useUserContext();
  const { getUser, isLoading: getLoading } = useGetUser();
  const { update, isLoading, successMessage, error, setError } =
    useUpdateUser();
  const [ref, setRef] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      ref?.current?.hide();
      navigate(links.homepage);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let apiUsername, apiEmail, apiPassword, apiImage;
    if (newPassword && newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    } else if (newPassword && newPassword === confirmNewPassword) {
      apiPassword = newPassword;
    }
    if (username !== initialUsername) {
      apiUsername = username;
    }
    if (email !== initialEmail) {
      apiEmail = email;
      setUpdatedEmail(apiEmail);
    }
    if (image !== initialImage) {
      apiImage = image;
    }
    const response = await update(
      apiUsername,
      apiEmail,
      password,
      apiPassword,
      apiImage
    );
    if (response.ok) {
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    ref.current.show();
  };

  return (
    <>
      {getLoading ? (
        <div className="container mt-5 ">
          <LoadingRing />
        </div>
      ) : (
        <div className="container mt-5 pb-4">
          <div className="row mb-3 d-flex justify-content-center align-items-start">
            <div className="col col-12 col-lg-3 d-flex flex-column align-items-center mb-2 me-3">
              <ImageComponent src={user?.image} classes={"profile-img"} />
              <RoleBanner role={user?.role} />
              <p className="mt-3 text-center">
                You've been a member since {memberSince}
              </p>
              <div className="mt-4 d-flex justify-content-between">
                <FollowButtons
                  id={user?._id}
                  followerNumber={followerNumber}
                  followingNumber={followingNumber}
                />
              </div>
            </div>
            <form
              className="update-form w-90 wide-input col col-12 col-lg-9 p-0 d-flex flex-column mt-3"
              onSubmit={handleSubmit}
            >
              <h2>Update Profile</h2>
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
                  Image URL:
                  <input
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                    }}
                    className="form-control form-control-lg"
                    type="url"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="w-100">
                  Current Password:
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
                  New Password:
                  <input
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    className="form-control form-control-lg"
                    type="password"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="w-100">
                  Confirm New Password:
                  <input
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                    }}
                    className="form-control form-control-lg"
                    type="password"
                  />
                </label>
              </div>
              <input
                disabled={isLoading || user?.isGoogleLogin}
                className="btn btn-primary wide-input mt-3"
                type="submit"
                value={
                  user?.isGoogleLogin ? "Google Users can't update" : "Submit"
                }
              />
              {error && <Popup message={error} type="danger" />}
              {successMessage && (
                <>
                  <Popup message={successMessage} type="success" />
                  {updatedEmail && (
                    <SendVerificationEmailButton email={updatedEmail} />
                  )}
                </>
              )}
            </form>
          </div>
          <div className="d-flex justify-content-center">
            <button onClick={handleDeleteAccount} className="btn btn-danger">
              Delete account
            </button>
          </div>
        </div>
      )}
      <ModalWrapper id={"deleteModal"} setRef={setRef}>
        <DeleteModal>
          <button
            type="button"
            className="btn-close bg-light position-absolute top-0 start-0 m-1"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </DeleteModal>
      </ModalWrapper>
    </>
  );
};
