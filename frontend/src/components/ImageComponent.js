import React from "react";

export const ImageComponent = ({ src, type, classes }) => {
  return (
    <img
      src={src}
      alt={type === "mini" ? "profile-img-mini" : "profile-img-large"}
      className={
        (type === "mini" ? "profile-img-mini " : "profile-img ") + classes
      }
      referrerPolicy="no-referrer"
    />
  );
};
