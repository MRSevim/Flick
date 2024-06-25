import React, { useState, useEffect } from "react";
import { Popup } from "./Popup";
import { useSendEmail } from "../Hooks/EmailHooks/UseSendEmail";
import { useSearchParams } from "react-router-dom";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg } from "../Utils/HelperFuncs";

export const Emailer = () => {
  const [email, setEmail] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const type = searchParams.get("type");
  const { sendEmail, isLoading, error, successMessage } = useSendEmail();
  const [darkMode] = useDarkModeContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await sendEmail(email, type);
  };
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      const send = async () => {
        await sendEmail(emailFromUrl, type);
      };
      send();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromUrl, setEmail]);
  return (
    <div className="container d-flex justify-content-center">
      <form
        className={
          "bg-primary p-5 border border-3 w-90 wide-input rounded " +
          addDarkBg(darkMode)
        }
        onSubmit={handleSubmit}
      >
        <select
          className="form-select mb-2"
          onChange={(e) => {
            searchParams.set("type", e.target.value);
            setSearchParams(searchParams);
          }}
          defaultValue={type}
        >
          <option value="send-verification-email">
            Send verification email
          </option>
          <option value="send-reset-password-email">Reset password</option>
        </select>
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

        <input
          disabled={isLoading}
          className="btn  btn-secondary mt-3"
          type="submit"
          value="Send"
        />

        {error && <Popup message={error} type="danger" />}
        {successMessage && <Popup message={successMessage} type="success" />}
      </form>
    </div>
  );
};
