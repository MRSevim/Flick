import React, { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export const ModalWrapper = ({ id, children, setRef }) => {
  const myModalRef = useRef(null);

  useEffect(() => {
    myModalRef.current = new Modal(document.getElementById(id), {
      backdrop: true,
      focus: true,
      keyboard: true,
    });
  }, [id]);
  useEffect(() => {
    setRef(myModalRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal fade" tabIndex="-1" id={id}>
      <div className="modal-dialog d-flex justify-content-center">
        <div className="modal-content mt-5 bg-primary border border-3 rounded">
          {children}
        </div>
      </div>
    </div>
  );
};
