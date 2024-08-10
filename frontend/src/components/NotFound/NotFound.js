import Image from "next/image";

export const NotFound = () => {
  return (
    <div className="container text-center h2">
      <div className="d-flex justify-content-center">
        <Image
          priority={true}
          src="/images/not-found.jpg"
          width="250"
          height="250"
          className="not-found-img"
          alt="confused robot"
          sizes="250px"
        />
      </div>
      <p className="my-4">Page you are looking for cannot be found!</p>
    </div>
  );
};
