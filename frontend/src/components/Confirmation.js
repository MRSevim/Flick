import React from "react";
import { useConfirmationContext } from "../Contexts/UseConfirmationContext";
import { ModalWrapper } from "./ModalWrapper";

export const Confirmation = () => {
  const { confirmation, setConfirmation, resetConfirmationPromise } =
    useConfirmationContext();

  const setRef = (ref) => {
    setConfirmation({ ...confirmation, ref });
  };

  const handleConfirm = () => {
    confirmation.outsideResolve(true);
    resetConfirmationPromise();
    confirmation.ref.current.hide();
  };

  const handleCancel = () => {
    confirmation.outsideResolve(false);
    resetConfirmationPromise();
    confirmation.ref.current.hide();
  };

  return (
    <ModalWrapper id={"confirmationModal"} setRef={setRef}>
      <div className=" d-flex flex-column text-center justify-content-center m-3 p-3">
        <button
          onClick={handleCancel}
          type="button"
          className="btn-close bg-light position-absolute top-0 start-0 m-1"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        {confirmation.type === "delete" && (
          <div>
            Are you sure you want to delete article titled:
            <p>
              <span className="fw-bold">{confirmation.info.title}</span> ?
            </p>
          </div>
        )}
        {confirmation.type === "deleteMany" && (
          <p>
            Are you sure you want to delete all {confirmation.info.size}{" "}
            selected articles?
          </p>
        )}
        <div>
          <button
            disabled={confirmation.isLoading}
            onClick={handleConfirm}
            className="btn btn-danger me-2"
          >
            Delete
          </button>
          <button
            disabled={confirmation.isLoading}
            onClick={handleCancel}
            className="btn btn-warning"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
