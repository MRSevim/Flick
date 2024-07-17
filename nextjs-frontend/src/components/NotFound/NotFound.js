import Image from "next/image";
import React from "react";

export const NotFound = () => {
  return (
    <div className="container text-center h2">
      <div className="d-flex justify-content-center">
        <div className="not-found-img position-relative">
          <Image
            src="/images/not-found.jpg"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "bottom",
            }}
            alt="confused robot"
            sizes="250px"
            fill
          />
        </div>
      </div>
      <p className="my-4">Page you are looking for cannot be found!</p>
    </div>
  );
};
