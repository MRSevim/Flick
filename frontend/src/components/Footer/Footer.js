"use client";
import "./Footer.css";
import Link from "next/link";
import links from "@/utils/Links";
import { addDarkBg } from "@/utils/HelperFuncs";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { envVariables } from "@/utils/HelperFuncs";

export const Footer = () => {
  const [darkMode] = useDarkModeContext();
  return (
    <footer className={"bg-primary " + addDarkBg(darkMode)}>
      <div className="container my-3 d-flex justify-content-between align-items-center">
        <div>
          <div>
            © 2024-{new Date().getFullYear()} {envVariables.websiteName}. All
            rights reserved.
          </div>
          <Link
            href={links.tocAndPrivacyPolicy}
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
              href={links.linkedIn}
              className="footer-link unstyled-link me-2"
              target="_blank"
            >
              <i className="bi bi-linkedin h4">
                <span class="visually-hidden">LinkedIn</span>
              </i>
            </Link>
            <Link
              href={links.mail}
              className="footer-link unstyled-link me-2"
              target="_blank"
            >
              <i className="bi bi-at h4">
                <span class="visually-hidden">Mail</span>
              </i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
