import NextImage from "next/image";
import { envVariables, redirectToImages } from "@/utils/HelperFuncs";

export const Image = ({ src, classes = "" }) => {
  if (!src) {
    return;
  }
  let modifiedSource, width, height, sizes;
  let newClasses = classes;
  const alt = classes.includes("profile-img") ? "profile" : "featured";

  if (classes.includes("profile-img-mini")) {
    width = "50";
    height = "50";
  } else if (classes.includes("profile-img")) {
    width = "200";
    height = "200";
    newClasses = newClasses + " rounded-circle";
  } else if (classes.includes("featured-image-mini")) {
    width = "0";
    height = "200";
    sizes = "100%";
  } else if (classes.includes("w-100") || classes.includes("w-auto")) {
    width = "0";
    height = "0";
    sizes = "100%";
  }

  if (
    src !== envVariables.defaultArticleImage &&
    src !== envVariables.defaultUserImage
  ) {
    try {
      Boolean(new URL(src));
    } catch (e) {
      return;
    }
  }
  if (
    src === envVariables.defaultArticleImage ||
    src === envVariables.defaultUserImage
  ) {
    modifiedSource = redirectToImages(src);
  }

  return (
    <NextImage
      width={width}
      height={height}
      src={modifiedSource || src}
      alt={alt}
      sizes={sizes}
      className={newClasses}
    />
  );
};
