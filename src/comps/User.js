import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPublicUser } from "./Hooks/UserHooks/UseGetPublicUser";

export const User = () => {
  const { username } = useParams();
  const { getPublicUser, isLoading } = useGetPublicUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const get = async () => {
      const json = await getPublicUser(username);
      setUser(json);
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, setUser]);

  return (
    <div className="container mt-3">
      {isLoading ? (
        <div className=" d-flex justify-content-center">
          <div className="lds-ring">
            <div></div>
          </div>
        </div>
      ) : (
        <div className="card">{user.username}</div>
      )}
    </div>
  );
};
