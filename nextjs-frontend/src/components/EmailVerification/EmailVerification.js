import { verifyEmailToken } from "@/utils/ApiCalls/EmailApiFunctions";
import { Popup } from "../Popup";

export const EmailVerification = async ({ token }) => {
  const error = await verifyEmailToken(token);

  return (
    <div className="container d-flex justify-content-center">
      {error && <Popup message={error} type="danger" />}
    </div>
  );
};
