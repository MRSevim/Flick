import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { LoadingRing } from "./LoadingRing";
import { useGetPms } from "../Hooks/PmHooks/UseGetPms";
import { addDarkBg } from "../Utils/HelperFuncs";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { MessageSender } from "./MessageSender";
import { ModalWrapper } from "./ModalWrapper";
import { Link, useSearchParams } from "react-router-dom";
import links from "../Utils/Links";
import { DeleteButton } from "./Articles/DeleteButton";
import { useDeletePm } from "../Hooks/PmHooks/UseDeletePm";
import { useDeleteMany } from "../Hooks/PmHooks/UseDeleteMany";
import { useGlobalErrorContext } from "../Contexts/GlobalErrorContext";

export const Pms = () => {
  const [section, setSection] = useState("received");
  const [searchParams, setSearchParams] = useSearchParams();
  const { deletePm, isLoading: deleteLoading } = useDeletePm();
  const openStr = searchParams.get("open");
  const open = openStr === "true";
  const [pms, setPms] = useState(null);
  const { getPms, isLoading } = useGetPms();
  const [darkMode] = useDarkModeContext();
  const [ref, setRef] = useState(null);
  const [selected, setSelected] = useState([]);
  const sectionLength = pms ? pms[section].length : null;
  const { deleteMany, isLoading: deleteManyLoading } = useDeleteMany();
  const [, setGlobalError] = useGlobalErrorContext();

  function handleSelect(id) {
    if (!selected.includes(id)) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  }
  function selectAll() {
    if (selected.length !== sectionLength) {
      const ids = pms[section].map((message) => message._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  }
  const deleteOne = async (id, subject) => {
    const response = await deletePm(id, subject);

    if (response && response.ok) {
      const { response, json } = await getPms();
      if (response.ok) {
        setPms(json.messages);
      }
    }
  };
  const deleteSelected = async (selected) => {
    if (selected.length === 0) {
      setGlobalError("Please select at least 1 message");
      return;
    }
    const response = await deleteMany(selected);
    if (response && response.ok) {
      const { response, json } = await getPms();
      if (response.ok) {
        setPms(json.messages);
      }
    }
  };
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
  useEffect(() => {
    if (ref?.current) {
      if (open) {
        ref.current.show();
      } else {
        ref.current.hide();
      }

      const myModal = document.getElementById("sendMessageModal");
      myModal.addEventListener("hide.bs.modal", () => {
        setSearchParams({
          open: "false",
        });
      });
    }
  }, [open, ref, setSearchParams]);
  return (
    <>
      <div className="pt-5">
        <div className="container ">
          <div className="row">
            <div className="col col-12 col-lg-3 text-center">
              <div
                className="btn btn-warning"
                onClick={() => {
                  setSearchParams({
                    open: "true",
                  });
                }}
              >
                Send New Message
              </div>
              <div
                className={classNames({
                  "bg-secondary text-white p-2  my-2 pointer": true,
                  active: section === "received",
                })}
                onClick={() => {
                  setSection("received");
                }}
              >
                Received Messages
              </div>
              <div
                className={classNames({
                  "bg-secondary text-white p-2 my-2 pointer": true,
                  active: section === "sent",
                })}
                onClick={() => {
                  setSection("sent");
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
                    {pms && pms[section] && pms[section].length > 0 && (
                      <>
                        <input
                          id="selectAll"
                          type="checkbox"
                          checked={selected.length === sectionLength}
                          onChange={() => {
                            selectAll();
                          }}
                        />{" "}
                        <label htmlFor="selectAll">Select all</label>
                        <button
                          disabled={deleteManyLoading || deleteLoading}
                          onClick={(e) => {
                            deleteSelected(selected);
                          }}
                          className="btn btn-danger ms-4"
                        >
                          <i className="bi bi-trash-fill"></i> Delete Selected
                        </button>
                      </>
                    )}
                  </div>
                  {pms && pms[section] && (
                    <div>
                      {!pms[section].length && (
                        <div className="m-3">
                          {`You have no ${section} messages to display`}
                        </div>
                      )}
                      {pms[section].map((message) => (
                        <div
                          key={message._id}
                          className={
                            "bg-primary rounded my-4 p-4 position-relative " +
                            addDarkBg(darkMode)
                          }
                        >
                          <input
                            className="position-absolute top-0 start-0 m-1"
                            type="checkbox"
                            checked={selected.includes(message._id)}
                            onChange={() => {
                              handleSelect(message._id);
                            }}
                          />
                          <DeleteButton
                            classes="p-1 m-1 position-absolute top-0 end-0"
                            onClick={() => {
                              deleteOne(message._id, message.subject);
                            }}
                            deleteLoading={deleteLoading || deleteManyLoading}
                          />
                          {section === "received" && (
                            <p>
                              <b className="me-2">From:</b>
                              <Link
                                to={links.publicUser(message.from._id)}
                                className="unstyled-link"
                              >
                                {message.from.username}
                              </Link>
                            </p>
                          )}
                          {section === "sent" && (
                            <p>
                              <b className="me-2">To:</b>
                              <Link
                                to={links.publicUser(message.to._id)}
                                className="unstyled-link"
                              >
                                {message.to.username}
                              </Link>
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
