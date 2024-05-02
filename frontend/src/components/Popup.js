import React from "react";

export const Popup = ({ message, type }) => {
  return (
    <div className={"text-center mt-3 wide-input alert alert-" + type}>
      {message}
    </div>
  );
};
