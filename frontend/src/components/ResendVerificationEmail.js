import React, { useState, useEffect } from "react";
import { Popup } from "./Popup";
import { useResendVerificationEmail } from "../Hooks/EmailHooks/UseResendVerificationEmail";
import { useSearchParams } from "react-router-dom";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg } from "../Utils/HelperFuncs";

export const ResendVerificationEmail = () => {
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const { resendVerificationEmail, isLoading, error, successMessage } =
    useResendVerificationEmail();
  const [darkMode] = useDarkModeContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await resendVerificationEmail(email);
  };
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      const resend = async () => {
        await resendVerificationEmail(emailFromUrl);
      };
      resend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromUrl, setEmail]);
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <form
        className={
          "bg-primary p-5 border border-3 rounded " + addDarkBg(darkMode)
        }
        onSubmit={handleSubmit}
      >
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

        <input
          disabled={isLoading}
          className="btn  btn-secondary mt-3"
          type="submit"
          value="Resend"
        />

        {error && <Popup message={error} type="danger" />}
        {successMessage && <Popup message={successMessage} type="success" />}
      </form>
    </div>
  );
};
