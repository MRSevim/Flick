import NextImage from "next/image";

export const Image = ({ src, classes = "" }) => {
  let modifiedSource;
  if (src === "/default-article.png" || src === "/default-user.jpg") {
    modifiedSource = "/images" + src;
  }

  if (classes.includes("profile-img-mini")) {
    return (
      <NextImage
        width="50"
        height="50"
        src={modifiedSource || src}
        alt="profile"
        className={classes}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <img
      src={modifiedSource || src}
      alt={classes.includes("profile-img") ? "profile" : "featured"}
      className={classes}
      referrerPolicy="no-referrer"
    />
  );
};
