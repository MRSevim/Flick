import { useEffect, useState } from "react";
import "./ArticleSections.css";
import { LoadingRing } from "@/components/LoadingRing";
import classNames from "classnames";
import { useDarkModeContext } from "@/contexts/DarkModeContext";

export const ArticleSections = ({ refProp }) => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [sectionsWithId, setSectionsWithId] = useState([]);
  const [darkMode] = useDarkModeContext();

  const setTheParentSectionsWithId = (id, headerNumber, newSections) => {
    let parents = [];
    let smallestHeaderNumber = headerNumber;
    const pushToParents = () => {
      const parent = sections.findLast((section) => {
        return (
          +section.id < +id && +section.node.nodeName[1] < smallestHeaderNumber
        );
      });
      if (parent) {
        parents.push(parent);
      }
    };
    while (smallestHeaderNumber > 1) {
      pushToParents();
      smallestHeaderNumber--;
    }

    parents.forEach((parent) => {
      setSectionsWithId((prevState) => {
        return prevState.map((item) => {
          if (+item.id === +parent.id) {
            return { ...item, sections: newSections };
          } else {
            return item;
          }
        });
      });
    });
  };

  const toggleHeadersBelow = (id, headerNumber) => {
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
        if (+section.id === +id) {
          return { ...section, toggled: !section.toggled };
        }
        if (+section.id > +id && i < toggleBefore && section.open === true) {
          return { ...section, open: false };
        } else {
          return section;
        }
      });

      setTheParentSectionsWithId(id, headerNumber, closedSections);

      setSections(closedSections);
    }
    //else get it from state or open them with filteredSections function if state does not exist
    else {
      const sectionsInState = sectionsWithId.find((item) => +item.id === +id);

      if (sectionsInState !== undefined) {
        const newState = [];

        sectionsInState.sections.forEach((section, i) => {
          if (+section.id >= +id && toggleBefore > i) {
            newState.push(section);
          } else {
            newState.push(sections[i]);
          }
        });

        setTheParentSectionsWithId(id, headerNumber, newState);
        setSections(newState);
      } else {
        const filteredSections = sections.map((section, i) => {
          if (+section.id === +id) {
            return { ...section, toggled: !section.toggled };
          }
          if (+section.id > +id && toggleBefore > i) {
            if (+section.node.nodeName[1] <= lowestHeaderNumber) {
              lowestHeaderNumber = +section.node.nodeName[1];
              return { ...section, open: !section.open };
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
        setTheParentSectionsWithId(+id, headerNumber, filteredSections);

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
  }, [refProp, refProp.current]);

  if (loading) {
    return <LoadingRing />;
  }

  return (
    <div className="py-3 sticky-lg-top">
      <h3 className="">Sections</h3>
      {sections?.length > 0 ? (
        <div>
          {sections.map((section) => {
            if (!section.open) return "";
            return (
              <div
                key={section.id}
                className={
                  "header px-1 border-info " + (darkMode && "border-white")
                }
              >
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
                  className="ps-1"
                  title={section.node.innerText}
                  href={"#" + section.id}
                >
                  {section.node.nodeName.substring(1)}.
                  {section.node.innerText.substring(0, 15)}
                  {section.node.innerText.length > 15 && "..."}
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
