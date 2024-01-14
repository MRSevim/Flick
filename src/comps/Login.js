import React, { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const modal = new bootstrap.Modal(document.getElementById("Modal"));
      modal.show();
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const userInfo = {
      username,
      password,
    };
    console.log(userInfo);
    setIsLoggedIn(true);
  };

  return (
    <>
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
        </form>
      </div>
      <div
        className="modal fade"
        id="Modal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">
                Action
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">This action does nothing for now.</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setIsLoggedIn(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
