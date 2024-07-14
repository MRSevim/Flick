"use client";
import { useState, useEffect } from "react";
import { Popup } from "../Popup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg } from "@/utils/HelperFuncs";
import { sendEmailCall } from "@/utils/ApiCalls/EmailApiFunctions";

const initialState = { error: "", successMessage: "" };

export const Emailer = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(useSearchParams().toString());
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(initialState);
  const type = searchParams.get("type");
  const [darkMode] = useDarkModeContext();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    setState(initialState);

    const { error, successMessage } = await sendEmailCall(email, type);

    setState({ error, successMessage });
    setIsLoading(false);
  };

  useEffect(() => {
    if (email) {
      handleSubmit();
    }
  }, []);

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
            params.set("type", e.target.value);
            replace(`${pathname}?${params.toString()}`);
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
              defaultValue={email || ""}
              onChange={(e) => {
                params.set("email", e.target.value);
                replace(`${pathname}?${params.toString()}`);
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

        {state.error && <Popup message={state.error} type="danger" />}
        {state.successMessage && (
          <Popup message={state.successMessage} type="success" />
        )}
      </form>
    </div>
  );
};
