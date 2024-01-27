import React, { useEffect } from "react";
import "./ArticleSections.css";

export const ArticleSections = ({ sections }) => {
  const toggleHeadersBelow = (e) => {
    e.target.classList.toggle("open");
    const headers = document.querySelectorAll(".header");
    const initialIndex = Array.prototype.indexOf.call(
      headers,
      e.target.parentNode
    );
    let headerClassBelow;
    let headerClassNumber;
    const initialHeaderClassNumber = +Array.from(
      headers[initialIndex].classList
    ).filter(function (className) {
      return className.startsWith("H");
    })[0][1];
    let index = initialIndex;

    if (headers[index + 1]) {
      headerClassBelow = +Array.from(headers[index + 1].classList).filter(
        function (className) {
          return className.startsWith("H");
        }
      )[0][1];
      headerClassNumber = initialHeaderClassNumber;
      if (headerClassNumber < headerClassBelow) {
        headers[index + 1].classList.toggle("hidden");
      }
      index++;
    }
    while (headers[index + 1]) {
      headerClassBelow = +Array.from(headers[index + 1].classList).filter(
        function (className) {
          return className.startsWith("H");
        }
      )[0][1];
      headerClassNumber = +Array.from(headers[index].classList).filter(
        function (className) {
          return className.startsWith("H");
        }
      )[0][1];
      if (
        headerClassNumber >= headerClassBelow &&
        headerClassBelow > initialHeaderClassNumber
      ) {
        headers[index + 1].classList.toggle("hidden");
      }
      index++;
      if (headerClassBelow <= initialHeaderClassNumber) {
        break;
      }
    }
  };

  useEffect(() => {
    const headers = document.querySelectorAll(".header");
    if (headers.length > 0) {
      let initialHeaderNumber = +Array.from(headers[0].classList).filter(
        function (className) {
          return className.startsWith("H");
        }
      )[0][1];
      headers.forEach((header, index) => {
        let nextHeader = headers[index + 1];
        let nextHeaderNumber;
        if (nextHeader) {
          let nextClassStartingWithH = Array.from(nextHeader.classList).filter(
            function (className) {
              return className.startsWith("H");
            }
          );
          nextHeaderNumber = +nextClassStartingWithH[0][1];
        }

        if (initialHeaderNumber >= nextHeaderNumber) {
          initialHeaderNumber = nextHeaderNumber;
        }
        if (initialHeaderNumber < nextHeaderNumber && nextHeaderNumber) {
          nextHeader.classList.add("hidden");
        }
      });
    }
    const togglers = document.querySelectorAll(".section-toggler");

    togglers.forEach((toggler) => {
      const hiddenHeaders = document.querySelectorAll(".hidden.header");
      toggler.click();
      const newHiddenHeaders = document.querySelectorAll(".hidden.header");

      let arrayEq = (A, B) =>
        A.length === B.length && A.every((e, i) => e === B[i]);
      if (arrayEq(Array.from(hiddenHeaders), Array.from(newHiddenHeaders))) {
        toggler.classList.add("hidden");
      }
      toggler.click();
    });

    togglers.forEach((toggler) => {});
  }, []);

  if (sections.length === 0) {
    return <p>No sections in the article</p>;
  }
  return sections.map((section) => {
    return (
      <div
        key={section.id}
        className={
          "header border-start border-end border-bottom border-dark " +
          section.nodeName +
          " id" +
          section.id
        }
      >
        <i
          onClick={toggleHeadersBelow}
          className="fa-solid fa-chevron-down ps-1 pe-1 section-toggler pointer"
        ></i>
        <a
          className="link-dark ps-1"
          title={section.innerText}
          href={"#" + section.id}
        >
          {section.nodeName.substring(1)}.{section.innerText.substring(0, 12)}
          ...
        </a>
      </div>
    );
  });
};
