import React from "react";

export const ImageComponent = ({ src, classes = "" }) => {
  return (
    <img
      src={src}
      alt={classes.includes("profile-img") ? "profile" : "featured"}
      className={classes}
      referrerPolicy="no-referrer"
    />
  );
};
