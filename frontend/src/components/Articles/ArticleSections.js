import React, { useEffect, useState } from "react";
import "./ArticleSections.css";
import { LoadingRing } from "../LoadingRing";
import classNames from "classnames";

export const ArticleSections = ({ refProp }) => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [sectionsWithId, setSectionsWithId] = useState([]);
  useEffect(() => {
    console.log(sections, sectionsWithId);
  }, [sections, sectionsWithId]);

  const toggleHeadersBelow = (id, headerNumber) => {
    setSections(
      sections.map((section) => {
        if (+section.id === +id) {
          section.toggled = !section.toggled;
          return section;
        } else {
          return section;
        }
      })
    );

    let toggleBefore = sections.findIndex((section) => {
      if (+section.node.nodeName[1] <= headerNumber && +section.id > +id) {
        return true;
      } else {
        return false;
      }
    });
    if (toggleBefore === -1) {
      toggleBefore = sections.length;
    }

    let lowestHeaderNumber = 6;

    const openSections = sections.some((section, i) => {
      if (+section.id > +id && i < toggleBefore && section.open === true) {
        return true;
      } else {
        return false;
      }
    });

    //If any open before toggleBefore, close them all
    if (openSections) {
      const closedSections = sections.map((section, i) => {
        if (+section.id > +id && i < toggleBefore && section.open === true) {
          return { ...section, open: false };
        } else {
          return section;
        }
      });
      console.log("closing");

      setSectionsWithId(
        sectionsWithId.map((item) => {
          const updatedSections = item.sections.map((section) => {
            if (+section.id > +id && section.node.nodeName[1] > headerNumber) {
              return { ...section, open: false };
            } else return section;
          });

          return { ...item, sections: updatedSections };
        })
      );

      setSections(closedSections);
    }
    //else get it from state or open them with filteredSections function if state does not exist
    else {
      console.log("opening");

      const sectionsInState = sectionsWithId.find((item) => +item.id === +id);

      if (sectionsInState !== undefined) {
        console.log("opened with state");

        const newState = [];
        sectionsInState.sections.forEach((section, i) => {
          if (+section.id > +id && toggleBefore > i) {
            newState.push(section);
          } else {
            newState.push(sections[i]);
          }
        });
        setSections(newState);
      } else {
        console.log("opened without state");
        const filteredSections = sections.map((section, i) => {
          if (+section.id > +id && toggleBefore > i) {
            if (+section.node.nodeName[1] <= lowestHeaderNumber) {
              lowestHeaderNumber = +section.node.nodeName[1];
              section.open = !section.open;
            }

            return section;
          } else {
            return section;
          }
        });

        //save the old state with id

        setSectionsWithId([
          ...sectionsWithId,
          { id, sections: filteredSections },
        ]);

        setSections(filteredSections);
      }
    }
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
        let obj = {};
        obj.toggled = false;
        obj.open = false;
        obj.togglerVisible = true;
        obj.node = element;
        if (+element.nodeName[1] <= lowestHeaderNumber) {
          obj.open = true;
          lowestHeaderNumber = +element.nodeName[1];
        }
        if (
          +element.nodeName[1] >=
          (elements[i + 1] ? +elements[i + 1].nodeName[1] : 0)
        ) {
          obj.togglerVisible = false;
        }
        element.id = initialId;
        obj.id = initialId++;

        headers.push(obj);
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
            if (!section.open) return "";
            return (
              <div key={section.id} className="header border-info">
                <i
                  onClick={() => {
                    toggleHeadersBelow(+section.id, +section.node.nodeName[1]);
                  }}
                  className={classNames({
                    "bi bi-chevron-down ps-1 pe-1 section-toggler pointer": true,
                    invis: !section.togglerVisible,
                    "bi-chevron-up": section.toggled,
                  })}
                ></i>
                <a
                  className="text-info ps-1"
                  title={section.innerText}
                  href={"#" + section.id}
                >
                  {section.node.nodeName.substring(1)}.
                  {section.node.innerText.substring(0, 15)}
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
