"use client";
import { useUserContext } from "@/contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import classNames from "classnames";
import links from "@/utils/Links";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Popup } from "@/components/Popup";
import { SendVerificationEmailButton } from "@/components/SendVerificationEmailButton";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { useFormState } from "react-dom";
import { loginCall } from "@/utils/ApiCalls/UserApiFunctionsOnClient";
import { useState } from "react";

export const Login = ({ onHideModal, children, type }) => {
  const [darkMode] = useDarkModeContext();
  const [rememberMe, setRememberMe] = useState(false);
  const [, setUser] = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleBefore = () => {
    setError(null);
    setIsLoading(true);
  };
  const handleAfter = async (error, user) => {
    setIsLoading(false);
    if (error) {
      setError(error);
      return;
    }

    if (onHideModal) {
      onHideModal();
    }
    setUser(user, rememberMe, "login" && !onHideModal);
    if (!onHideModal) {
      router.push(links.homepage);
    }
  };

  const handleSubmit = async (prevState, formData) => {
    handleBefore();
    const { error, user } = await loginCall(
      {
        isGoogleLogin: false,
        googleCredential: null,
        rememberMe,
      },
      formData
    );

    handleAfter(error, user);
  };

  const [, formAction] = useFormState(handleSubmit, "");

  const handleGoogleLogin = async (credential) => {
    handleBefore();
    const { error, user } = await loginCall(
      {
        isGoogleLogin: true,
        googleCredential: credential,
        rememberMe,
      },
      null
    );
    handleAfter(error, user);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <form
          className={classNames({
            "bg-primary p-5 wide-input w-90": true,
            "border border-3 rounded": type !== "modal",
            "bg-dark-primary": darkMode,
          })}
          action={formAction}
        >
          {children}
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
              Password:
              <input
                name="password"
                className="form-control form-control-lg"
                type="password"
                required
              />
            </label>
          </div>
          <input
            disabled={isLoading}
            className="btn btn-secondary my-3"
            type="submit"
            value="Login"
          />
          <div className="form-check mb-2">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                value={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>
          <p className="text-center">
            By logging in, you agree to our{" "}
            <Link
              href={links.tocAndPrivacyPolicy}
              className="unstyled-link hovered-link"
              target="_blank"
            >
              Terms of Conditions (ToC) and Privacy Policy
            </Link>
          </p>
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                console.log("Failed logging in with Google");
              }}
            />
          </div>
          <p className="text-center mt-3">
            Don't have an account?
            <Link href={links.signup()}>
              <button
                onClick={onHideModal}
                type="button"
                className="btn btn-outline-light ms-2"
              >
                Create one...
              </button>
            </Link>
          </p>
          <div className="text-center">
            <Link
              className="unstyled-link hovered-link"
              href={links.emailer(null, "send-reset-password-email")}
            >
              Forgot Password?
            </Link>
          </div>
          {error && (
            <>
              <Popup message={error} type="danger" />
              {error === "Please verify your account first" && (
                <SendVerificationEmailButton />
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};
