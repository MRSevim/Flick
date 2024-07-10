import NextImage from "next/image";

export const Image = ({ src, classes = "" }) => {
  if (classes.includes("profile-img-mini")) {
    return (
      <NextImage
        width="50px"
        height="50px"
        src={src}
        alt="profile"
        className={classes}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <img
      src={src}
      alt={classes.includes("profile-img") ? "profile" : "featured"}
      className={classes}
      referrerPolicy="no-referrer"
    />
  );
};
