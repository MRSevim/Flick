import React, { useEffect } from "react";
import "./ArticleSections.css";

export const ArticleSections = ({ sections }) => {
  const toggleHeadersBelow = (e) => {
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

    let initialHeaderNumber = +Array.from(headers[0].classList).filter(
      function (className) {
        return className.startsWith("H");
      }
    )[0][1];
    headers.forEach((header, index) => {
      let nextHeader = headers[index + 1];
      let nextHeaderNumber;
      if (nextHeader) {
        let nextclassStartingWithH = Array.from(nextHeader.classList).filter(
          function (className) {
            return className.startsWith("H");
          }
        );
        nextHeaderNumber = +nextclassStartingWithH[0][1];
      }

      if (initialHeaderNumber >= nextHeaderNumber) {
        initialHeaderNumber = nextHeaderNumber;
      }
      if (initialHeaderNumber < nextHeaderNumber && nextHeaderNumber) {
        nextHeader.classList.add("hidden");
      }
    });
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
          section.nodeName
        }
      >
        <i
          onClick={toggleHeadersBelow}
          className=" fa-solid fa-chevron-down me-1"
          style={{ cursor: "pointer" }}
        ></i>
        <a
          className="link-dark"
          title={section.innerText}
          href={"#" + section.id}
        >
          {section.nodeName.substring(1)}.{section.innerText.substring(0, 15)}
          ...
        </a>
      </div>
    );
  });
};
