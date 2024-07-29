import { useEffect, useState } from "react";
import classNames from "classnames";
import links from "@/utils/Links";
import Link from "next/link";
import { LoadingDots } from "../LoadingDots";
import { getReceivedLengthCall } from "@/utils/ApiCalls/PmApiFunctions";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";

export const PmIcon = () => {
  const [receivedLengths, setReceivedLengths] = useState(null);
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const get = async () => {
      setIsLoading(true);
      setGlobalError(null);
      const { error, json } = await getReceivedLengthCall();
      setIsLoading(false);
      if (error) {
        setGlobalError(error);
        return;
      }

      setReceivedLengths(json);
    };

    get();
  }, []);

  return (
    <div className="me-3 position-relative">
      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          <Link href={links.pms} className="unstyled-link">
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
