import React from "react";

export const RemoveImageButton = ({ disabled, onClick }) => {
  return (
    <button disabled={disabled} onClick={onClick} className="btn btn-secondary">
      Remove Image
    </button>
  );
};
