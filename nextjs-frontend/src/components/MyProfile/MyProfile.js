"use client";
import { useUserContext } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

export const MyProfile = ({ json }) => {
  const [initialUsername, setInitialUsername] = useState(json.username);
  const [initialEmail, setInitialEmail] = useState(json.email);
  const [initialImage, setInitialImage] = useState(json.image);
  const [username, setUsername] = useState(json.username);
  const [email, setEmail] = useState(json.email);
  const [image, setImage] = useState(json.image);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [user] = useUserContext();
  const [ref, setRef] = useState(null);
  const [removeImageClicked, setRemoveImageClicked] = useState(false);
  const date = new Date(json.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /*  const handleSubmit = async (e) => {
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
  }; */

  /*   const removeImage = async () => {
    setImage(envVariables.defaultUserImage);
    setRemoveImageClicked(true);
  };
  useEffect(() => {
    if (image === envVariables.defaultUserImage && removeImageClicked) {
      submitButton.current.click();
      setRemoveImageClicked(false);
    }
  }, [image, removeImageClicked, setRemoveImageClicked]); */

  /*   const handleDeleteAccount = async () => {
    ref.current.show();
  }; */

  /*   const generateModLink = async () => {
    const { response, json } = await generateModLinkCall();
    if (response.ok) {
      const link = links.signup(json.token);

      console.log("Link is " + window.location.origin + link);
    }
  }; */

  return (
    <div className="container">
      <div className="row mb-3 d-flex justify-content-center align-items-start">
        <div className="col col-12 col-lg-3 d-flex flex-column align-items-center mb-2 me-3">
          <ImageComponent src={user?.image} classes={"profile-img"} />
          <div className="d-flex justify-content-center my-3">
            <RemoveImageButton
              visible={
                image !== envVariables.defaultUserImage && !user?.isGoogleLogin
              }
              disabled={isLoading}
              onClick={removeImage}
            />
          </div>
          <RoleBanner role={user?.role} />
          <p className="text-center">
            You've been a member since {formattedDate}
          </p>
          {user?.role === "admin" && (
            <div className="d-flex justify-content-center">
              <button
                disabled={generateModLinkLoading}
                onClick={generateModLink}
                className="btn btn-secondary"
              >
                Generate Mod Link{" "}
              </button>
            </div>
          )}
          <div className="mt-4 d-flex justify-content-between">
            <FollowButtons
              id={user?._id}
              followerNumber={json.followerNumber}
              followingNumber={json.followingNumber}
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
                type="text"
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
            ref={submitButton}
            disabled={isLoading || user?.isGoogleLogin}
            className="btn btn-primary wide-input mt-3"
            type="submit"
            value={user?.isGoogleLogin ? "Google Users can't update" : "Submit"}
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
    </div>
  );
};
