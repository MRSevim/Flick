import React, { useEffect, useState } from "react";
import "./ArticleSections.css";

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export const ArticleSections = ({ sections }) => {
  const [loading, setLoading] = useState(true);

  const toggleHeadersBelow = (e) => {
    e.target.classList.toggle("open");
    const headers = document.querySelectorAll(".header");
    const initialIndex = Array.prototype.indexOf.call(
      headers,
      e.target.parentNode
    );
    const initialHeaderClassNumber = +Array.from(
      headers[initialIndex].classList
    ).filter(function (className) {
      return className.startsWith("H");
    })[0][1];
    let index = initialIndex;
    let appendables = [];

    //Add invs icon to last element
    headers[headers.length - 1].classList.add("invisible-icon");

    if (headers[index].nextSibling) {
      if (!headers[index].nextSibling.classList.contains("container-div")) {
        const div = document.createElement("div");
        div.classList.add("container-div");

        while (headers[index + 1]) {
          const headerClassBelow = +Array.from(
            headers[index + 1].classList
          ).filter(function (className) {
            return className.startsWith("H");
          })[0][1];
          const headerClass = +Array.from(headers[index].classList).filter(
            function (className) {
              return className.startsWith("H");
            }
          )[0][1];

          if (headerClassBelow > initialHeaderClassNumber) {
            appendables.push(headers[index + 1]);
          }
          if (headerClass > headerClassBelow) {
            headers[index].classList.add("invisible-icon");
          }
          if (headerClassBelow <= initialHeaderClassNumber) {
            break;
          }

          index++;
        }

        appendables.forEach((appendable) => {
          div.appendChild(appendable);
        });
        div.classList.toggle("hidden");
        insertAfter(headers[initialIndex], div);
      } else {
        headers[index].nextSibling.classList.toggle("hidden");
      }
    }
  };

  useEffect(() => {
    const togglers = document.querySelectorAll(".section-toggler");
    togglers.forEach((toggler) => {
      toggler.click();
      toggler.classList.remove("open");
    });

    const invisibleIcons = document.querySelectorAll(".invisible-icon");

    invisibleIcons.forEach((item) => {
      item.querySelector("i").classList.add("invis");
    });

    const containers = document.querySelectorAll(".container-div");
    containers.forEach((container) => {
      container.classList.add("hidden");
    });

    setLoading(false);

    document.querySelector("div.invis")?.classList?.remove("invis");
  }, [setLoading, sections]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="lds-ring">
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {sections && sections.length > 0 ? (
        sections.map((section) => (
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
              {section.nodeName.substring(1)}.
              {section.innerText.substring(0, 15)}
              ...
            </a>
          </div>
        ))
      ) : sections && sections.length === 0 ? (
        <p>No sections in the article.</p>
      ) : (
        <div></div>
      )}
    </div>
  );
};
