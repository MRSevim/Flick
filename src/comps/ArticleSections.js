import React, { useEffect } from "react";

export const ArticleSections = ({ sections }) => {
  const toggleHeadersBelow = (e) => {
    const partClass = Array.from(e.target.parentNode.classList).filter(
      (className) => {
        return className.startsWith("part");
      }
    )[0];

    let HeaderClassNumber = +Array.from(e.target.parentNode.classList).filter(
      function (className) {
        return className.startsWith("H");
      }
    )[0][1];

    while (HeaderClassNumber < 7) {
      HeaderClassNumber++;
      const headersOneHigher = document.querySelectorAll(
        "." + partClass + ".H" + HeaderClassNumber
      );
      if (headersOneHigher.length > 0) {
        headersOneHigher.forEach((header) => {
          header.classList.toggle("hidden");
        });
        break;
      }
    }
  };

  useEffect(() => {
    let initialClassNumber = 1;
    let initialClass = "part" + initialClassNumber;
    const headers = document.querySelectorAll(".header");

    let initialHeaderNumber = +Array.from(headers[0].classList).filter(
      function (className) {
        return className.startsWith("H");
      }
    )[0][1];
    headers.forEach((header, index) => {
      let classList = header.classList;
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

      classList.add(initialClass);

      if (initialHeaderNumber >= nextHeaderNumber) {
        initialHeaderNumber = nextHeaderNumber;
        initialClassNumber++;
        initialClass = "part" + initialClassNumber;
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
        className={"header header" + section.id + " " + section.nodeName}
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
