import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { updateUserCall } from "@/utils/ApiCalls/UserApiFunctions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("successMessage");
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();

  const update = async (username, email, password, newPassword, image) => {
    setIsLoading(true);

    const { error, successMessage, userObject } = await updateUserCall(
      username,
      email,
      password,
      newPassword,
      image
    );

    setIsLoading(false);
    if (error) {
      setError(error);
      return { error };
    }
    if (successMessage) {
      // update the user context
      setUser(userObject);

      // update url
      params.set("successMessage", successMessage);
      if (email) {
        params.set("updatedEmail", email);
      }
      router.replace(pathname + "?" + params.toString());

      return { successMessage };
    }
  };

  return {
    update,
    isLoading,
    successMessage,
    error,
    setError,
  };
};
