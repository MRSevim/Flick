export const DeleteUser = () => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <button onClick={handleDeleteAccount} className="btn btn-danger">
          Delete account
        </button>
      </div>
      <ModalWrapper id={"deleteModal"} setRef={setRef}>
        <DeleteModal>
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
