import NextImage from "next/image";
import { envVariables } from "@/utils/HelperFuncs";

export const Image = ({ src, classes = "" }) => {
  if (!src) {
    return;
  }
  let modifiedSource, width, height;
  const alt = classes.includes("profile-img") ? "profile" : "featured";

  if (classes.includes("profile-img-mini")) {
    width = "50";
    height = "50";
  } else if (classes.includes("profile-img")) {
    width = "200";
    height = "200";
  }

  if (
    src === envVariables.defaultArticleImage ||
    src === envVariables.defaultUserImage
  ) {
    modifiedSource = "/images" + src;
  }

  return (
    <NextImage
      priority={true}
      width={width}
      height={height}
      src={modifiedSource || src}
      alt={alt}
      className={classes}
      referrerPolicy="no-referrer"
    />
  );
};
