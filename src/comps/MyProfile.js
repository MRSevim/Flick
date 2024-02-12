import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./Contexts/UserContext";
import userApi from "./Utils/UserApiFunctions";

export const MyProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [user] = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      navigate("/");
    }
    const getUser = async () => {
      const res = await userApi.getProfile();
      const json = await res.json();
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
    };
    getUser();
  });

  const handleSubmit = () => {};

  return formVisible ? (
    <div className="container mt-5 d-flex justify-content-center">
      <form className="" onSubmit={handleSubmit}>
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
          /* disabled={isLoading} */
          className="btn btn-warning mt-3"
          type="submit"
          value="Submit"
        />
        {/*   {error && (
          <div className="text-center mt-3 wide-input alert alert-danger">
            {error}
          </div>
        )} */}
        <p className="wide-input mt-5 text-center">
          You are a member since {memberSince}
        </p>
      </form>
    </div>
  ) : (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="lds-ring">
        <div></div>
      </div>
    </div>
  );
};
