import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { LoadingRing } from "./LoadingRing";
import { useGetPms } from "../Hooks/PmHooks/UseGetPms";
import { addDarkBg, confirmationWrapper } from "../Utils/HelperFuncs";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { MessageSender } from "./MessageSender";
import { ModalWrapper } from "./ModalWrapper";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import links from "../Utils/Links";
import { DeleteButton } from "./Articles/DeleteButton";
import { useDeletePm } from "../Hooks/PmHooks/UseDeletePm";
import { useDeleteMany } from "../Hooks/PmHooks/UseDeleteMany";
import { useGlobalErrorContext } from "../Contexts/GlobalErrorContext";
import pmApi from "../Utils/PmApiFunctions";
import { useRefetchForPmIconContext } from "../Contexts/RefetchForPmIcon";
import { Pagination } from "@mui/material";
import { useConfirmationContext } from "../Contexts/UseConfirmationContext";

export const Pms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { deletePm, isLoading: deleteLoading } = useDeletePm();
  const openStr = searchParams.get("open");
  const open = openStr === "true";
  const [totalPages, setTotalPages] = useState(null);
  const page = +searchParams.get("page");
  const type = searchParams.get("type");
  const [, setRefetchForPmIcon] = useRefetchForPmIconContext();
  const [pms, setPms] = useState(null);
  const { getPms, isLoading } = useGetPms();
  const navigate = useNavigate();
  const [darkMode] = useDarkModeContext();
  const [ref, setRef] = useState(null);
  const [selected, setSelected] = useState([]);
  const pmsLength = pms ? pms.length : null;
  const { deleteMany, isLoading: deleteManyLoading } = useDeleteMany();
  const [, setGlobalError] = useGlobalErrorContext();
  const { confirmation, setConfirmation } = useConfirmationContext();

  const get = async () => {
    if (!page) {
      navigate(links.pms);
      return;
    }
    const { response, json } = await getPms(page, type);
    if (response.ok) {
      setPms(json.messages);
      setTotalPages(json.totalPages);
    }
  };
  const triggerRefetchForPmIcon = () => {
    if (type === "received") {
      setRefetchForPmIcon((prev) => prev + 1);
    }
  };
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
        return await deletePm(id, subject);
      },
      () => {
        get();
        triggerRefetchForPmIcon();
      }
    );
  };

  const handleMarkAsReadClick = async () => {
    const response = await pmApi.markAsRead();
    if (response.ok) {
      triggerRefetchForPmIcon();
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
        return await deleteMany(selected);
      },
      () => {
        get();
        triggerRefetchForPmIcon();
      }
    );
  };
  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value);
    setSearchParams(searchParams);
  };
  useEffect(() => {
    if (totalPages && pms.length === 0) {
      searchParams.set("page", totalPages);
      setSearchParams(searchParams);
    }
  }, [totalPages, pms, searchParams, setSearchParams]);

  useEffect(() => {
    setSelected([]);
  }, [pms]);

  useEffect(() => {
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page]);

  useEffect(() => {
    if (ref?.current) {
      if (open) {
        ref.current.show();
      } else {
        ref.current.hide();
      }

      const myModal = document.getElementById("sendMessageModal");
      myModal.addEventListener("hide.bs.modal", () => {
        searchParams.set("open", "false");
        setSearchParams(searchParams);
      });
    }
  }, [open, ref, setSearchParams, searchParams]);
  return (
    <>
      <div className="pt-5">
        <div className="container">
          <div className="row">
            <div className="col col-12 col-lg-3 text-center">
              <div
                className="btn btn-warning"
                onClick={() => {
                  searchParams.set("open", "true");
                  setSearchParams(searchParams);
                }}
              >
                Send New Message
              </div>
              <div
                className={classNames({
                  "bg-secondary text-white p-2  my-2 pointer": true,
                  active: type === "received",
                })}
                onClick={() => {
                  searchParams.set("type", "received");
                  setSearchParams(searchParams);
                }}
              >
                Received Messages
              </div>
              <div
                className={classNames({
                  "bg-secondary text-white p-2 my-2 pointer": true,
                  active: type === "sent",
                })}
                onClick={() => {
                  searchParams.set("type", "sent");
                  setSearchParams(searchParams);
                }}
              >
                Sent Messages
              </div>
            </div>
            <div className="col col-12 col-lg-9">
              {isLoading && (
                <div className="container mt-5">
                  <LoadingRing />
                </div>
              )}
              {!isLoading && (
                <>
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
                            <label
                              className="form-check-label"
                              htmlFor="selectAll"
                            >
                              Select all
                            </label>
                            <button
                              disabled={deleteManyLoading || deleteLoading}
                              onClick={(e) => {
                                deleteSelected(selected);
                              }}
                              className="btn btn-danger ms-0 ms-sm-4"
                            >
                              <i className="bi bi-trash-fill"></i> Delete
                              Selected
                            </button>
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
                                  searchParams.set("open", "true");
                                  searchParams.set(
                                    "username",
                                    message.from.username
                                  );
                                  searchParams.set("_id", message.from._id);
                                  searchParams.set(
                                    "subject",
                                    "Re:" + message.subject
                                  );
                                  setSearchParams(searchParams);
                                }}
                              >
                                <i className="bi bi-reply me-1"></i>Reply
                              </button>
                            )}
                            <DeleteButton
                              classes="p-1 m-1"
                              onClick={() => {
                                deleteOne(message._id, message.subject);
                              }}
                              deleteLoading={deleteLoading || deleteManyLoading}
                            />
                          </div>
                          {type === "received" && (
                            <p>
                              <b className="me-2">From:</b>
                              {message.from && (
                                <Link
                                  to={links.publicUser(message.from._id)}
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
                                  to={links.publicUser(message.to._id)}
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
                              className="mt-1 article-card-inner-html"
                              dangerouslySetInnerHTML={{
                                __html: message.message,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalWrapper
        dialogClasses={"modal-lg"}
        id={"sendMessageModal"}
        setRef={setRef}
      >
        <MessageSender
          type={type}
          page={page}
          pms={pms}
          setPms={setPms}
          open={open}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
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
