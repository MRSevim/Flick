import { loginCall } from "@/utils/ApiCalls/UserApiFunctionsOnClient";
import { GoogleLogin } from "@react-oauth/google";

export const GoogleLoginComp = ({ handleBefore, handleAfter, rememberMe }) => {
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
    <>
      <p className="text-center my-2">or</p>
      <div className="d-flex justify-content-center mt-2">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleGoogleLogin(credentialResponse.credential);
          }}
          onError={() => {
            console.log("Failed logging in with Google");
          }}
        />
      </div>
    </>
  );
};
