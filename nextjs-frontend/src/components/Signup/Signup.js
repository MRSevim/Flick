"use client";
import Link from "next/link";
import links from "@/utils/Links";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { addDarkBg } from "@/utils/HelperFuncs";
import { Popup } from "../Popup";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { SendVerificationEmailButton } from "../SendVerificationEmailButton";
import { signupCall } from "@/utils/ApiCalls/UserApiFunctions";
import { useState } from "react";

const initialState = { error: "", successMessage: "" };

export const SignUp = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [darkMode] = useDarkModeContext();
  const handleSubmit = signupCall.bind(null, token);
  const [state, formAction] = useFormState(handleSubmit, initialState);

  return (
    <div className="container pb-4">
      <div className=" d-flex justify-content-center">
        <form
          className={
            "bg-primary p-5 wide-input w-90 border border-3 rounded " +
            addDarkBg(darkMode)
          }
          action={formAction}
        >
          <div className="form-group">
            <label className="w-100">
              Username:
              <input
                name="username"
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
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                className="form-control form-control-lg"
                type="email"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label className="w-100">
              Password:
              <input
                name="password"
                className="form-control form-control-lg"
                type="password"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label className="w-100">
              Confirm Password:
              <input
                name="confirmPassword"
                className="form-control form-control-lg wide-input"
                type="password"
                required
              />
            </label>
          </div>
          <div className="form-check mt-3">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                required
                name="accepted"
              />
              I agree to the{" "}
              <Link
                href={links.tocAndPrivacyPolicy}
                className="unstyled-link hovered-link"
                target="_blank"
              >
                Terms of Conditions (ToC) and Privacy Policy
              </Link>
            </label>
          </div>
          <SubmitButton />
          <p className="text-center mt-3">
            Already have an account?
            <Link href={links.login}>
              <button type="button" className="btn btn-outline-light ms-2">
                Login
              </button>
            </Link>
          </p>
          {state.error && <Popup message={state.error} type="danger" />}
          {state.successMessage && (
            <>
              <Popup message={state.successMessage} type="success" />
              <SendVerificationEmailButton email={email} re={true} />
            </>
          )}
        </form>
      </div>{" "}
    </div>
  );
};
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <input
      disabled={pending}
      className="btn btn-secondary mt-3"
      type="submit"
      value="Sign-up"
    />
  );
};
