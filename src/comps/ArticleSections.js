import React, { useEffect } from "react";

export const ArticleSections = ({ sections }) => {
  const toggleHeadersOneBelow = (e) => {
    const classList = e.target.parentElement.classList;
    const headers = document.querySelectorAll(".header");
    // Filter classes that start with 'H'
    const classStartingWithH = Array.from(classList).filter((className) => {
      return className.startsWith("H");
    });
    const headerNumber = +classStartingWithH[0][1];

    headers.forEach((header) => {
      const classStartingWithH = Array.from(header.classList).filter(
        (className) => {
          return className.startsWith("H");
        }
      );

      if (headerNumber < +classStartingWithH[0][1]) {
        header.classList.toggle("hidden");
      }
      console.log(header);
    });
  };

  useEffect(() => {
    let sectionHeaderNumbers = [];
    sections.forEach((section, index) => {
      if (sections[index - 1]) {
        /*If There is previous header that is smaller, make the header link disappear*/
        if (
          section.nodeName.substring(1) >
            sections[index - 1].nodeName.substring(1) ||
          sectionHeaderNumbers.slice(0, index).some((element) => {
            return element < +section.nodeName.substring(1);
          })
        ) {
          document.querySelector(".header" + index).classList.add("hidden");
        }
      }
      sectionHeaderNumbers.push(+section.nodeName.substring(1));
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
          onClick={toggleHeadersOneBelow}
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
