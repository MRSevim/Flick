import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { LoadingRing } from "./LoadingRing";
import { useGetPms } from "../Hooks/PmHooks/UseGetPms";
import { addDarkBg } from "../Utils/HelperFuncs";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { MessageSender } from "./MessageSender";
import { ModalWrapper } from "./ModalWrapper";

export const Pms = () => {
  const [section, setSection] = useState("received");
  const [pms, setPms] = useState(null);
  const { getPms, isLoading } = useGetPms();
  const [darkMode] = useDarkModeContext();
  const [ref, setRef] = useState(null);

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
    <>
      <div className="pt-5">
        <div className="container">
          <div className="position-relative">
            <div className="d-flex justify-content-center">
              <div
                className={classNames({
                  "bg-secondary text-white p-2 me-3 pointer": true,
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
                  "bg-secondary text-white p-2 me-3 pointer": true,
                  active: section === "sent",
                })}
                onClick={() => {
                  setSection("sent");
                }}
              >
                Sent Messages
              </div>
            </div>
            <div
              className="btn btn-warning position-absolute top-0 end-0"
              onClick={() => {
                ref.current.show();
              }}
            >
              Send New Message
            </div>
          </div>
          <div>
            {isLoading && (
              <div className="container mt-5">
                <LoadingRing />
              </div>
            )}
            {!isLoading && (
              <>
                {pms && pms[section] && (
                  <div>
                    {pms[section].map((message) => (
                      <div
                        key={message._id}
                        className={
                          "bg-primary rounded my-4 p-3 " + addDarkBg(darkMode)
                        }
                      >
                        {section === "received" && (
                          <p>
                            <b className="me-2">From:</b>
                            {message.from.username}
                          </p>
                        )}
                        {section === "sent" && (
                          <p>
                            <b className="me-2">To:</b>
                            {message.to.username}
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
      <ModalWrapper
        dialogClasses={"modal-lg"}
        id={"sendMessageModal"}
        setRef={setRef}
      >
        <MessageSender>
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
