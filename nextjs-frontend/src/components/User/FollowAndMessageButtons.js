import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { followCall } from "@/utils/ApiCalls/FollowApiFunctions";
import links from "@/utils/Links";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export const FollowAndMessageButtons = ({ user, following }) => {
  const [, setGlobalError] = useGlobalErrorContext();

  const handleSubmit = async () => {
    const { error } = await followCall(user._id);
    if (error) {
      setGlobalError(error);
    }
  };
  const [, formAction] = useFormState(handleSubmit, null);

  return (
    <form action={formAction} className="text-center mt-3">
      <SubmitButton following={following} />
      <Link
        className="btn btn-primary"
        href={links.sendPm(user.username, user._id)}
      >
        <i className="bi bi-chat-left"></i>
      </Link>
    </form>
  );
};

const SubmitButton = ({ following }) => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn btn-primary me-3">
      {following ? "Unfollow" : "Follow"}
    </button>
  );
};
