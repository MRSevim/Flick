import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import links from "../Utils/Links";

export const Footer = () => {
  return (
    <footer className="bg-primary text-info">
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
