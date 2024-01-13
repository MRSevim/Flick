import React, { useState } from "react";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const userInfo = {
      username,
      password,
      email,
    };
    console.log(userInfo);
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
        <input className="btn btn-warning mt-3" type="submit" value="Sign-up" />
      </form>
    </div>
  );
};
