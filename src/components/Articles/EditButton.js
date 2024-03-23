import React from "react";

export const EditButton = ({ onClick, classes }) => {
  return (
    <button onClick={onClick} className={"btn btn-warning " + classes}>
      <i className="bi bi-pencil-fill"></i>
    </button>
  );
};
