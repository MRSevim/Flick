import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-info">
      <div className="container my-3 d-flex justify-content-between align-items-center">
        <div>© 2024 Flick. All rights reserved.</div>
        <div>
          <b>Contact</b>
          <div className="d-flex mt-2">
            <Link
              to={"https://www.linkedin.com/in/muhammed-ra%C5%9Fid-sevim/"}
              className="footer-link unstyled-link me-2"
              target="_blank"
            >
              <i className="bi bi-linkedin h4"></i>
            </Link>
            <Link
              to={"mailto: lionrasit@gmail.com"}
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
