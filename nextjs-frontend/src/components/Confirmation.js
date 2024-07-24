"use client";
import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { ModalWrapper } from "./ModalWrapper";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { Popup } from "./Popup";

export const Confirmation = () => {
  const { confirmation, setConfirmation } = useConfirmationContext();
  const [confirmationError] = useConfirmationErrorContext();

  const setRef = (ref) => {
    setConfirmation({ ...confirmation, ref });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    confirmation.functionToRun(confirmation.info?.reason);
  };

  const handleCancel = () => {
    confirmation.ref.current.hide();
  };

  const generateTextArea = () => {
    if (confirmation.info?.owned) {
      return;
    }
    return (
      <div className="mb-3">
        <label htmlFor="textarea" className="form-label">
          Reason:
        </label>

        <textarea
          value={confirmation?.info.reason}
          required
          onChange={(e) => {
            setConfirmation({
              ...confirmation,
              info: { ...confirmation.info, reason: e.target.value },
            });
          }}
          className="form-control"
          id="textarea"
          rows="3"
        />
      </div>
    );
  };

  return (
    <ModalWrapper id={"confirmationModal"} setRef={setRef}>
      <form
        onSubmit={handleConfirm}
        className=" d-flex flex-column text-center justify-content-center m-3 p-3"
      >
        <button
          onClick={handleCancel}
          type="button"
          className="btn-close bg-light position-absolute top-0 start-0 m-1"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        {confirmation.type === "deleteArticle" && (
          <div>
            Are you sure you want to delete article titled:
            <p>
              <span className="fw-bold">{confirmation.info.title}</span> ?
            </p>
            {generateTextArea()}
          </div>
        )}
        {confirmation.type === "banUser" && (
          <div>
            Are you sure you want to ban {confirmation.info.username}?
            {generateTextArea()}
          </div>
        )}
        {confirmation.type === "deleteManyArticles" && (
          <p>
            Are you sure you want to delete all {confirmation.info.size}{" "}
            selected articles?
          </p>
        )}
        {confirmation.type === "deleteMessage" && (
          <div className="mb-3">
            Are you sure you want to delete message with subject of:
            <p>
              <span className="fw-bold">{confirmation.info.subject}</span> ?
            </p>
            Please note that it will only be deleted from your inbox.
          </div>
        )}
        {confirmation.type === "deleteManyMessages" && (
          <p>
            Are you sure you want to delete all {confirmation.info.size}{" "}
            selected messages? Please note that they will only be deleted from
            your inbox.
          </p>
        )}
        {confirmation.type === "deleteComment" && (
          <>
            <p>Are you sure you want to delete the comment?</p>
            {generateTextArea()}
          </>
        )}
        <div>
          <button
            type="submit"
            disabled={confirmation.isLoading}
            className="btn btn-danger me-2"
          >
            {confirmation.type === "banUser" ? "Ban" : "Delete"}
          </button>
          <button
            type="button"
            disabled={confirmation.isLoading}
            onClick={handleCancel}
            className="btn btn-warning"
          >
            Cancel
          </button>
        </div>
        {confirmationError && (
          <>
            <Popup message={confirmationError} type="danger" />
          </>
        )}
      </form>
    </ModalWrapper>
  );
};
