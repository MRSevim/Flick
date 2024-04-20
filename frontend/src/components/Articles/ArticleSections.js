import React, { useEffect, useState } from "react";
import "./ArticleSections.css";
import { LoadingRing } from "../LoadingRing";
import classNames from "classnames";

export const ArticleSections = ({ refProp }) => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const toggleHeadersBelow = (id, headerNumber) => {
    setSections(
      sections.map((section) => {
        if (section.id === id) {
          section.open = !section.open;
          return section;
        } else return section;
      })
    );
    let toggleBefore = sections.findIndex((section) => {
      if (+section.nodeName[1] <= headerNumber && +section.id > +id) {
        return true;
      } else {
        return false;
      }
    });
    if (toggleBefore === -1) {
      toggleBefore = sections.length;
    }

    let lowestHeaderNumber = 6;

    const filteredSections = sections.map((section, i) => {
      if (+section.id > +id && toggleBefore > i) {
        if (+section.nodeName[1] <= lowestHeaderNumber) {
          lowestHeaderNumber = +section.nodeName[1];
          section.visible = !section.visible;
        }

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
    let lowestHeaderNumber = 6;

    if (refProp.current) {
      const elements = refProp.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      elements.forEach((element, i) => {
        element.open = false;
        element.visible = false;
        element.togglerVisible = true;
        if (+element.nodeName[1] <= lowestHeaderNumber) {
          element.visible = true;
          lowestHeaderNumber = +element.nodeName[1];
        }
        if (
          +element.nodeName[1] >=
          (elements[i + 1] ? +elements[i + 1].nodeName[1] : 0)
        ) {
          element.togglerVisible = false;
        }
        element.id = initialId++;
        headers.push(element);
      });

      setSections(headers);
    }
    setLoading(false);
  }, [refProp]);

  if (loading) {
    return <LoadingRing />;
  }

  return (
    <div>
      {sections?.length > 0 ? (
        <div>
          {sections.map((section) => {
            if (!section.visible) return "";
            return (
              <div key={section.id} className="header border-info">
                <i
                  onClick={() => {
                    toggleHeadersBelow(section.id, +section.nodeName[1]);
                  }}
                  className={classNames({
                    "bi bi-chevron-down ps-1 pe-1 section-toggler pointer": true,
                    invis: !section.togglerVisible,
                    "bi-chevron-up": section.open,
                  })}
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
