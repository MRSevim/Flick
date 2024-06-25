import React, { useEffect } from "react";
import { LoadingRing } from "./LoadingRing";
import { useVerifyEmailToken } from "../Hooks/EmailHooks/UseVerifyEmailToken";
import { useNavigate, useParams } from "react-router-dom";
import { Popup } from "./Popup";
import { delay } from "../Utils/HelperFuncs";
import { useUserContext } from "../Contexts/UserContext";
import links from "../Utils/Links";

export const EmailVerification = () => {
  const { token } = useParams();
  const { verifyEmailToken, isLoading, successMessage, setSuccessMessage } =
    useVerifyEmailToken();
  const [user] = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const { response } = await verifyEmailToken(token);

      if (response.ok) {
        if (user) {
          setSuccessMessage(
            "Verification is successful, redirecting to My profile..."
          );
          await delay(5000);
          navigate(links.myProfile);
        } else {
          setSuccessMessage(
            "Verification is successful, redirecting to login page..."
          );
          await delay(5000);
          navigate(links.login);
        }
      }
    };

    verify();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className="container d-flex justify-content-center">
      <div>
        {isLoading && <LoadingRing></LoadingRing>}
        {successMessage && <Popup message={successMessage} type="success" />}
      </div>
    </div>
  );
};
