"use client";
import { useState } from "react";
import { Popup } from "../Popup";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg } from "@/utils/HelperFuncs";
import { sendEmailCall } from "@/utils/ApiCalls/EmailApiFunctions";

const initialState = { error: "", successMessage: "" };

export const Emailer = ({ stateProp, emailProp, typeProp }) => {
  const [email, setEmail] = useState(emailProp || "");
  const [type, setType] = useState(typeProp || "");
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(stateProp || initialState);
  const [darkMode] = useDarkModeContext();

  const handleSubmit = async () => {
    setIsLoading(true);
    setState(initialState);

    const { error, successMessage } = await sendEmailCall(email, type);

    setState({ error, successMessage });
    setIsLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center">
      <form
        className={
          "bg-primary p-5 border border-3 w-90 wide-input rounded " +
          addDarkBg(darkMode)
        }
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <select
          className="form-select mb-2"
          onChange={(e) => {
            setType(e.target.value);
          }}
          value={type}
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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
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

        {state.error && <Popup message={state.error} type="danger" />}
        {state.successMessage && (
          <Popup message={state.successMessage} type="success" />
        )}
      </form>
    </div>
  );
};
