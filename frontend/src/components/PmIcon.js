import React, { useEffect, useState } from "react";

import classNames from "classnames";
import links from "../Utils/Links";
import { Link } from "react-router-dom";
import { LoadingDots } from "./LoadingDots";
import { useRefetchForPmIconContext } from "../Contexts/RefetchForPmIcon";
import { useGetReceivedLength } from "../Hooks/PmHooks/UseGetReceivedLength";

export const PmIcon = () => {
  const [refetchForPmIcon] = useRefetchForPmIconContext();
  const [receivedLengths, setReceivedLengths] = useState(null);
  const { getReceivedLength, isLoading } = useGetReceivedLength();

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getReceivedLength();
      if (response.ok) {
        setReceivedLengths(json);
      }
    };

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchForPmIcon]);
  return (
    <div className="me-3 position-relative">
      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          <Link to={links.pms} className="unstyled-link">
            <i
              className={classNames({
                "bi h4 m-0 pointer": true,
                "bi-envelope": receivedLengths?.receivedTotalLength === 0,
                "bi-envelope-fill": receivedLengths?.receivedTotalLength > 0,
              })}
            >
              {" "}
            </i>
          </Link>
          {receivedLengths?.receivedUnreadLength > 0 && (
            <div className="fs-6 bg-secondary text-white rounded-circle position-absolute top-0 start-100 translate-middle px-1">
              {receivedLengths?.receivedUnreadLength}
            </div>
          )}
        </>
      )}
    </div>
  );
};
