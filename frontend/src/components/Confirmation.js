import React from "react";
import { useConfirmationContext } from "../Contexts/UseConfirmationContext";
import { ModalWrapper } from "./ModalWrapper";

export const Confirmation = () => {
  const [confirmation, setConfirmation] = useConfirmationContext();

  const setRef = (ref) => {
    setConfirmation({ ...confirmation, ref });
  };

  return (
    <ModalWrapper id={"confirmationModal"} setRef={setRef}>
      <div className=" d-flex flex-column text-center justify-content-center m-3 p-3">
        <button
          type="button"
          className="btn-close bg-light position-absolute top-0 start-0 m-1"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        Are you sure you want to {confirmation.info.text}
        <p>
          <span className="fw-bold">{confirmation.info.title} </span>?
        </p>
        <div>
          <button
            disabled={confirmation.isLoading}
            onClick={() => {
              setConfirmation({ ...confirmation, confirmed: true });
            }}
            className="btn btn-danger me-2"
          >
            Delete
          </button>
          <button
            disabled={confirmation.isLoading}
            onClick={() => {
              confirmation.ref.current.hide();
            }}
            className="btn btn-warning"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
