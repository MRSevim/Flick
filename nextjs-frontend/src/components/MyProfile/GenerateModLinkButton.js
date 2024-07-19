import { generateModLinkCall } from "@/utils/ApiCalls/UserApiFunctions";
import { Popup } from "../Popup";
import { useFormState, useFormStatus } from "react-dom";
import links from "@/utils/Links";

export const GenerateModLinkButton = ({ role }) => {
  const generateModLinkSubmit = async () => {
    const { token, error } = await generateModLinkCall();

    if (error) {
      return error;
    }
    console.log("Link is " + window.location.origin + links.signup(token));
  };

  const [error, formAction] = useFormState(generateModLinkSubmit, "");

  if (role === "admin") {
    return (
      <form action={formAction} className="d-flex justify-content-center">
        <SubmitButton />
        {error && <Popup message={error} type="danger" />}
      </form>
    );
  }
};

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn btn-secondary">
      Generate Mod Link{" "}
    </button>
  );
};
