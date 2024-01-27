import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "./UserContext";

export const Login = ({ onHideModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useUserContext();
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const userInfo = {
      username,
      password,
    };

    const user = { username: userInfo.username };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    if (onHideModal) {
      onHideModal();
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center">
        <form className="" onSubmit={handleSubmit}>
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
          <input className="btn btn-warning mt-3" type="submit" value="Login" />
          <div className="text-center mt-3 wide-input">
            For now any entry will work. Type anything to test the website.
          </div>
        </form>
      </div>
    </>
  );
};
