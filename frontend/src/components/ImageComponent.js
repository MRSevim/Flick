import React from "react";
import { envVariables } from "../Utils/HelperFuncs";

export const ImageComponent = ({ src, classes = "" }) => {
  let imageSource;
  if (
    src === envVariables.defaultUserImage ||
    src === envVariables.defaultArticleImage
  ) {
    imageSource = envVariables.appUrl + src;
  } else {
    imageSource = src;
  }
  return (
    <img
      src={imageSource}
      alt={classes.includes("profile-img") ? "profile" : "featured"}
      className={classes}
      referrerPolicy="no-referrer"
    />
  );
};
