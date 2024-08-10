import { useState } from "react";

export const Slider = ({ children, itemLength }) => {
  let sliderLength;
  if (typeof window !== "undefined") {
    sliderLength =
      window.innerWidth > 991 ? Math.round(itemLength / 2) : itemLength;
  }
  const [sliderIndex, setSliderIndex] = useState(0);
  const goLeft = () => {
    if (sliderIndex > 0) {
      setSliderIndex((prev) => prev - 1);
    }
  };
  const goRight = () => {
    if (sliderIndex < sliderLength - 1) {
      setSliderIndex((prev) => prev + 1);
    }
  };
  return (
    <div className="position-relative overflow-hidden">
      <div
        style={{ right: sliderIndex * 100 + "%" }}
        className="d-flex position-relative slider "
      >
        {children}
      </div>
      {sliderIndex > 0 && (
        <i
          onClick={goLeft}
          className="pointer bg-black bg-opacity-25 rounded h2 bi bi-chevron-compact-left position-absolute top-50 start-0 translate-middle-y"
        ></i>
      )}
      {sliderIndex < sliderLength - 1 && (
        <i
          onClick={goRight}
          className="pointer bg-black bg-opacity-25 rounded h2 bi bi-chevron-compact-right position-absolute top-50 end-0 translate-middle-y"
        ></i>
      )}
    </div>
  );
};
