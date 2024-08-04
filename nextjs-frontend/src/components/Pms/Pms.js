"use client";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { addDarkBg, confirmationWrapper, timeAgo } from "@/utils/HelperFuncs";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { MessageSender } from "./MessageSender";
import { ModalWrapper } from "@/components/ModalWrapper";
import Link from "next/link";
import links from "@/utils/Links";

import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { Pagination } from "@mui/material";
import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { markAsReadCall } from "@/utils/ApiCalls/PmApiFunctions";
import { useDeleteMany } from "@/hooks/UseDeleteManyPmsCall";
import { useUserContext } from "@/contexts/UserContext";
import { useDeletePm } from "@/hooks/UseDeletePm";
import { GenericDeleteButton } from "../GenericDeleteButton";
import { GenericDeleteSelectedButton } from "../GenericDeleteSelectedButton";

export const Pms = ({ json }) => {
  const searchParams = useSearchParams();
  const open = searchParams.get("open") === "true";
  const page = +searchParams.get("page");
  const type = searchParams.get("type");
  const pms = json.messages;
  const pmsLength = pms.length;
  const totalPages = json.totalPages;
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode] = useDarkModeContext();
  const [ref, setRef] = useState(null);
  const [selected, setSelected] = useState([]);
  const [, setGlobalError] = useGlobalErrorContext();
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { deleteMany, isLoading: deleteManyLoading } = useDeleteMany();
  const { deletePm, isLoading: deleteLoading } = useDeletePm();
  const [user] = useUserContext();

  function handleSelect(id) {
    if (!selected.includes(id)) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  }
  function selectAll() {
    if (selected.length !== pmsLength) {
      const ids = pms.map((message) => message._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  }
  const deleteOne = async (id, subject) => {
    confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...confirmation,
          type: "deleteMessage",
          info: {
            ...prev.info,
            subject,
          },
        };
      },
      setConfirmation,
      async () => {
        return await deletePm(id, type, user._id);
      },
      () => {}
    );
  };

  const handleMarkAsReadClick = async () => {
    const error = await markAsReadCall(user._id);
    if (error) {
      setGlobalError(error);
    }
  };
  const deleteSelected = async (selected) => {
    if (selected.length === 0) {
      setGlobalError("Please select at least 1 message");
      return;
    }
    confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...confirmation,

          type: "deleteManyMessages",
          info: {
            ...prev.info,
            size: selected.length,
          },
        };
      },
      setConfirmation,
      async () => {
        return await deleteMany(selected, type, user._id);
      },
      () => {}
    );
  };
  const handlePaginationChange = (event, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value);
    router.push(pathname + "?" + params.toString());
  };

  useEffect(() => {
    if (totalPages && pms.length === 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", totalPages);
      router.push(pathname + "?" + params.toString());
    }
  }, [totalPages, pms]);

  useEffect(() => {
    setSelected([]);
  }, [pms]);

  useEffect(() => {
    if (ref?.current) {
      if (open) {
        ref.current.show();
      } else {
        ref.current.hide();
      }

      const myModal = document.getElementById("sendMessageModal");
      myModal.addEventListener("hide.bs.modal", () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("open", "false");
        router.push(pathname + "?" + params.toString());
      });
    }
  }, [open, ref, searchParams]);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col col-12 col-lg-3 text-center d-flex flex-column">
            <div
              className="btn btn-warning"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("open", "true");
                router.push(pathname + "?" + params.toString());
              }}
            >
              Send New Message
            </div>
            <Link
              className={classNames({
                "bg-secondary text-white p-2 mt-2 pointer": true,
                active: type === "received",
              })}
              href={links.pms("received")}
            >
              Received Messages
            </Link>
            <Link
              className={classNames({
                "bg-secondary text-white p-2 mt-2 pointer": true,
                active: type === "sent",
              })}
              href={links.pms("sent")}
            >
              Sent Messages
            </Link>
          </div>
          <div className="col col-12 col-lg-9">
            <div className="mt-3">
              {pms && pms.length > 0 && (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        id="selectAll"
                        type="checkbox"
                        checked={selected.length === pmsLength}
                        onChange={() => {
                          selectAll();
                        }}
                      />{" "}
                      <label className="form-check-label" htmlFor="selectAll">
                        Select all
                      </label>
                      <GenericDeleteSelectedButton
                        disabled={deleteManyLoading || deleteLoading}
                        onClick={(e) => {
                          deleteSelected(selected);
                        }}
                        classes="ms-0 ms-sm-4"
                      />
                    </div>
                    {type === "received" && (
                      <button
                        onClick={handleMarkAsReadClick}
                        className="btn btn-secondary"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="d-flex justify-content-center">
                    {
                      <Pagination
                        page={Number(page)}
                        showFirstButton
                        showLastButton
                        count={totalPages}
                        shape="rounded"
                        onChange={handlePaginationChange}
                      />
                    }
                  </div>
                </>
              )}
            </div>
            {pms && (
              <div>
                {!pms.length && (
                  <div className="m-3">
                    {`You have no ${type} messages to display`}
                  </div>
                )}
                {pms.map((message) => (
                  <div
                    key={message._id}
                    className={
                      "bg-primary rounded my-4 p-4 position-relative " +
                      addDarkBg(darkMode)
                    }
                  >
                    <input
                      className="position-absolute top-0 start-0 m-1 form-check-input"
                      type="checkbox"
                      checked={selected.includes(message._id)}
                      onChange={() => {
                        handleSelect(message._id);
                      }}
                    />
                    <div className="position-absolute top-0 end-0">
                      {type === "received" && (
                        <button
                          className={
                            "p-1 m-1 btn btn-secondary " +
                            (darkMode && "btn-primary")
                          }
                          onClick={() => {
                            const params = new URLSearchParams(
                              searchParams.toString()
                            );
                            params.set("open", "true");
                            params.set("username", message.from.username);
                            params.set("_id", message.from._id);
                            params.set("subject", "Re:" + message.subject);
                            router.push(pathname + "?" + params.toString());
                          }}
                        >
                          <i className="bi bi-reply me-1"></i>Reply
                        </button>
                      )}
                      <GenericDeleteButton
                        disabled={deleteManyLoading || deleteLoading}
                        classes="p-1 m-1"
                        onClick={() => {
                          deleteOne(message._id, message.subject);
                        }}
                      />
                    </div>
                    {type === "received" && (
                      <p>
                        <b className="me-2">From:</b>
                        {message.from && (
                          <Link
                            href={links.publicUser(message.from._id)}
                            className="unstyled-link"
                          >
                            {message.from.username}
                          </Link>
                        )}
                      </p>
                    )}
                    {type === "sent" && (
                      <p>
                        <b className="me-2">To:</b>
                        {message.to && (
                          <Link
                            href={links.publicUser(message.to._id)}
                            className="unstyled-link"
                          >
                            {message.to.username}
                          </Link>
                        )}
                      </p>
                    )}
                    <p>
                      <b className="me-2">Subject:</b>
                      {message.subject}
                    </p>
                    <div>
                      <b className="me-2">Message:</b>
                      <div
                        className="my-2 article-card-inner-html text-wrap text-break"
                        dangerouslySetInnerHTML={{
                          __html: message.message,
                        }}
                      ></div>
                    </div>
                    <div className="position-absolute bottom-0 end-0 m-1 p-1 fw-lighter">
                      {timeAgo.format(new Date(message.date))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalWrapper
        dialogClasses={"modal-lg"}
        id={"sendMessageModal"}
        setRef={setRef}
      >
        <MessageSender
          user={user}
          refProp={ref}
          searchParams={searchParams}
          router={router}
        >
          <button
            type="button"
            className="btn-close bg-light position-absolute top-0 start-0 m-1"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </MessageSender>
      </ModalWrapper>
    </>
  );
};
