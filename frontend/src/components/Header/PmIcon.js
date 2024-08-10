"use client";
import { useEffect } from "react";
import classNames from "classnames";
import links from "@/utils/Links";
import Link from "next/link";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";

export const PmIcon = ({ json, error }) => {
  const receivedLengths = json;
  const [, setGlobalError] = useGlobalErrorContext();

  useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error]);

  return (
    <div className="me-3 position-relative">
      <Link href={links.pms("received")} className="unstyled-link">
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
    </div>
  );
};
