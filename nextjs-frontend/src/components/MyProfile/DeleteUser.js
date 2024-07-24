import { useState } from "react";
import { ModalWrapper } from "../ModalWrapper";
import { DeleteModal } from "./DeleteModal";

export const DeleteUser = () => {
  const [ref, setRef] = useState(null);

  const handleDeleteClick = async () => {
    ref.current.show();
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <button onClick={handleDeleteClick} className="btn btn-danger">
          Delete account
        </button>
      </div>
      <ModalWrapper id={"deleteModal"} setRef={setRef}>
        <DeleteModal refProp={ref}>
          <button
            type="button"
            className="btn-close bg-light position-absolute top-0 start-0 m-1"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </DeleteModal>
      </ModalWrapper>
    </>
  );
};
