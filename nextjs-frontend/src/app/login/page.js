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
import { useFormStatus, useFormState } from "react-dom";
import userApi from "@/utils/ApiCalls/UserApiFunctions";

const page = ({ onHideModal, children, type }) => {
  const [darkMode] = useDarkModeContext();

  const [user, setUser] = useUserContext();
  const router = useRouter();

  const hideModalIfExists = (response) => {
    if (response.ok && onHideModal) {
      onHideModal();
    }
  };

  const handleSubmit = async (prevState, formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMeString") === "on";

    const response = await userApi.login(
      username,
      password,
      false,
      null,
      rememberMe
    );
    const json = await response.json();

    if (!response.ok) {
      return json.message;
    }

    hideModalIfExists(response);
  };
  const handleGoogleLogin = async (credential) => {
    /*  const response = await login(null, null, true, credential, rememberMe); */

    hideModalIfExists(response);
  };
  const [error, formAction] = useFormState(handleSubmit, "");
  return (
    <div className="container pb-4">
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
          <SubmitButton />
          <div className="form-check mb-2">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                name="rememberMeString"
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
                setError("Failed logging in with Google");
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
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <input
      aria-disabled={pending}
      className="btn btn-secondary my-3"
      type="submit"
      value="Login"
    />
  );
}
export default page;
