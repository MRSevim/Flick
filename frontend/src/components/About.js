import React from "react";
import { Link } from "react-router-dom";

export const About = () => {
  return (
    <div className="container mt-5 ">
      <h1>About</h1>
      <p>
        Hello everyone, first of all thank you for visiting the website. I have
        developed/am still developing the website with the purpose of helping
        users express their thought and emotions in written format. I have
        referred this written media as "articles" throughout the website.
      </p>
      <h3>About the developer</h3>
      <p>
        My name is Muhammed Raşid Sevim. I am based in Turkey and I have been
        learning web development since August 2023. This website is my first
        full stack application. I wanted to make something useful while also
        adding to my web development skills. For more information about me, you
        can check my{" "}
        <Link
          to={"https://www.linkedin.com/in/muhammed-ra%C5%9Fid-sevim/"}
          className="unstyled-link about-link"
          target="_blank"
        >
          LinkedIn
        </Link>{" "}
        page and my{" "}
        <Link
          to={"https://mrsevim.github.io/Portfolio/"}
          className="unstyled-link about-link"
          target="_blank"
        >
          portfolio
        </Link>
        .
      </p>
      <h3>Mission</h3>
      <h3>Values</h3>
    </div>
  );
};
