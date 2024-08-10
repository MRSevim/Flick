import { useEffect, useRef } from "react";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg } from "@/utils/HelperFuncs";

export const ModalWrapper = ({ id, children, setRef, dialogClasses }) => {
  const myModalRef = useRef(null);
  const [darkMode] = useDarkModeContext();

  useEffect(() => {
    const { Modal } = require("bootstrap");
    myModalRef.current = new Modal(document.getElementById(id), {
      backdrop: true,
      focus: true,
      keyboard: true,
    });
  }, [id]);
  useEffect(() => {
    setRef(myModalRef);
  }, []);

  return (
    <div className="modal fade" tabIndex="-1" id={id}>
      <div
        className={
          "modal-dialog d-flex justify-content-center " + dialogClasses
        }
      >
        <div
          className={
            "modal-content mt-5 bg-primary border border-3 rounded " +
            addDarkBg(darkMode)
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};
