import React, { createElement, useEffect, useRef, useState } from "react";
import "./ArticleSections.css";
import { LoadingRing } from "../LoadingRing";

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export const ArticleSections = ({ refProp }) => {
  /*   const toggleHeadersBelow = (e) => {
    e.target.classList.toggle("open");
    const headers = ref?.current?.querySelectorAll(".header");
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
        const div = createElement(
          "div",
          { className: "container-div" },
          appendables
        );

         div.classList.toggle("hidden");
        insertAfter(headers[initialIndex], div);
      } else {
        headers[index].nextSibling.classList.toggle("hidden");
      }
    }
  };
    useEffect(() => {
      if (ref.current) {
        const togglers = ref.current.querySelectorAll(".section-toggler");
        togglers.forEach((toggler) => {
          toggler.click();
          toggler.classList.remove("open");
        });

        const invisibleIcons = ref.current.querySelectorAll(".invisible-icon");

        invisibleIcons.forEach((item) => {
          item.querySelector("i").classList.add("invis");
        });

        const containers = ref.current.querySelectorAll(".container-div");
        containers.forEach((container) => {
          container.classList.add("hidden");
        });
      }
      setLoading(false);
    }, [ref.current, setLoading, sections]); */

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const toggleHeadersBelow = (id, headerNumber) => {
    const indexOfNextEqualHeaderNumber = sections.findIndex((section) => {
      if (+section.nodeName[1] === headerNumber && section.id > id) return true;
    });

    const filteredSections = sections.map((section, i) => {
      if (
        section.id > id &&
        (indexOfNextEqualHeaderNumber > -1
          ? indexOfNextEqualHeaderNumber > i
          : true)
      ) {
        section.visible = !section.visible;
        return section;
      } else {
        return section;
      }
    });

    setSections(filteredSections);
  };
  useEffect(() => {
    let headers = [];
    let initialId = 0;
    let LowestHeaderNumber = 6;

    if (refProp.current) {
      refProp.current
        .querySelectorAll("h1, h2, h3, h4, h5, h6")
        .forEach((element) => {
          element.visible = false;
          if (+element.nodeName[1] <= LowestHeaderNumber) {
            element.visible = true;
            LowestHeaderNumber = +element.nodeName[1];
          }
          element.id = initialId++;
          headers.push(element);
        });

      setSections(headers);
    }
    setLoading(false);
  }, [refProp.current]);

  if (loading) {
    return <LoadingRing />;
  }

  return (
    <div>
      {sections?.length > 0 ? (
        <div>
          {sections.map((section) => {
            if (!section.visible) return;
            return (
              <div
                key={section.id}
                className={
                  "header border-info d-flex " +
                  section.nodeName +
                  " id" +
                  section.id
                }
              >
                <i
                  onClick={() => {
                    toggleHeadersBelow(section.id, +section.nodeName[1]);
                  }}
                  className="bi bi-chevron-down ps-1 pe-1 section-toggler pointer"
                ></i>
                <a
                  className="text-info ps-1"
                  title={section.innerText}
                  href={"#" + section.id}
                >
                  {section.nodeName.substring(1)}.
                  {section.innerText.substring(0, 15)}
                  ...
                </a>
              </div>
            );
          })}
        </div>
      ) : sections?.length === 0 ? (
        <p>No sections in the article.</p>
      ) : (
        <div></div>
      )}
    </div>
  );
};
