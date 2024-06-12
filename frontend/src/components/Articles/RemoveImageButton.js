import React from "react";

export const RemoveImageButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-secondary">
      Remove Image
    </button>
  );
};
