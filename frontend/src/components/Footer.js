import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import links from "../Utils/Links";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg } from "../Utils/HelperFuncs";

export const Footer = () => {
  const [darkMode] = useDarkModeContext();
  return (
    <footer className={"bg-primary " + addDarkBg(darkMode)}>
      <div className="container my-3 d-flex justify-content-between align-items-center">
        <div>
          <div>
            © 2024 {process.env.REACT_APP_WEBSITE_NAME}. All rights reserved.
          </div>
          <Link
            to={links.tocAndPrivacyPolicy}
            className="unstyled-link hovered-link"
            target="_blank"
          >
            Terms of Conditions (ToC) and Privacy Policy
          </Link>
        </div>
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
