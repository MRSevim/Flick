import React, { useEffect, useState } from "react";
import { getUnreadLength } from "../Utils/HelperFuncs";
import classNames from "classnames";
import { useGetPms } from "../Hooks/PmHooks/UseGetPms";
import links from "../Utils/Links";
import { Link } from "react-router-dom";
import { LoadingDots } from "./LoadingDots";

export const PmIcon = () => {
  const [pms, setPms] = useState(null);
  const { getPms, isLoading } = useGetPms();

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getPms();
      if (response.ok) {
        setPms(json.messages);
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="me-3 position-relative">
      <Link to={links.pms} className="unstyled-link">
        <i
          className={classNames({
            "bi h4 m-0 pointer": true,
            "bi-chat-left": pms?.received?.length === 0,
            "bi-chat-left-fill": pms?.received?.length > 0,
          })}
        >
          {" "}
          {isLoading && <LoadingDots />}
        </i>
      </Link>
      {getUnreadLength(pms?.received) > 0 && (
        <div className="fs-6 bg-secondary text-white rounded-circle position-absolute top-0 start-100 translate-middle px-1">
          {getUnreadLength(pms?.received)}
        </div>
      )}
    </div>
  );
};
