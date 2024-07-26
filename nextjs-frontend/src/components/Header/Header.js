"use client";
import Link from "next/link";
import "./Header.css";
import links from "@/utils/Links";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { addDarkBg } from "@/utils/HelperFuncs";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { SearchBar } from "./SearchBar";
import RightSide from "./RightSide";

export const Header = () => {
  const [darkMode] = useDarkModeContext();
  const location = usePathname();

  const setActiveClassNames = (type) => {
    const path = "/" + type.split("/")[1];
    const splitLocation = "/" + location.split("/")[1];

    return classNames({
      "nav-link px-2 text-info": true,
      active: splitLocation === path,
      "text-white": darkMode,
    });
  };

  return (
    <header className={"bg-primary p-3 " + addDarkBg(darkMode)}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <h2 className="d-flex flex-column pe-lg-3 mb-2 mb-lg-0">
            <b className="extra-spaced">Flick</b>
            <b className="h5">Articles</b>
          </h2>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            {[
              { link: links.homepage, text: "Home" },
              { link: links.mostLiked("week"), text: "Most Liked" },
              { link: links.createAnArticle, text: "Create An Article" },
              { link: links.about, text: "About" },
            ].map((item) => (
              <li key={item.link} className="nav-item">
                <Link
                  href={item.link}
                  className={setActiveClassNames(item.link)}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
          <SearchBar />
          <RightSide />
        </div>
      </div>
    </header>
  );
};
