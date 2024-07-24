import NextImage from "next/image";
import { envVariables } from "@/utils/HelperFuncs";

export const Image = ({ src, classes = "" }) => {
  if (!src) {
    return;
  }
  let modifiedSource, width, height, sizes;
  const alt = classes.includes("profile-img") ? "profile" : "featured";

  if (classes.includes("profile-img-mini")) {
    width = "50";
    height = "50";
  } else if (classes.includes("profile-img")) {
    width = "200";
    height = "200";
  } else if (classes.includes("w-100")) {
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
    modifiedSource = "/images" + src;
  }

  return (
    <NextImage
      priority={true}
      width={width}
      height={height}
      src={modifiedSource || src}
      alt={alt}
      sizes={sizes}
      className={classes}
      referrerPolicy="no-referrer"
    />
  );
};
