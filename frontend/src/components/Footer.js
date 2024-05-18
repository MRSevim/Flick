import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import links from "../Utils/Links";
import { useDarkModeContext } from "../Contexts/DarkModeContext";

export const Footer = () => {
  const [darkMode] = useDarkModeContext();
  return (
    <footer className={"bg-primary " + (darkMode && " bg-dark-primary")}>
      <div className="container my-3 d-flex justify-content-between align-items-center">
        <div>© 2024 Flick. All rights reserved.</div>
        <div>
          <b>Contact</b>
          <div className="d-flex mt-2">
            <Link
              to={links.linkedIn}
              className="footer-link unstyled-link me-2"
              target="_blank"
            >
              <i className="bi bi-linkedin h4"></i>
            </Link>
            <Link
              to={links.mail}
              className="footer-link unstyled-link me-2"
              target="_blank"
            >
              <i className="bi bi-at h4"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
