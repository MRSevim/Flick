import React from "react";

export const Home = () => {
  return (
    <>
      <div className="bg-dark">
        <div className="container text-white mt-3 py-3">
          <h2>
            These are some of the things you will be able to do with the
            website.
          </h2>
          <ul>
            <li>Login and sign-up to an account</li>
            <li>Create, edit, delete articles</li>
            <li>Like each other's articles</li>
            <li>
              Follow each other and get notified when someone posts and likes
              your articles
            </li>
            <li>See most liked articles</li>
            <li>Search users and articles</li>
          </ul>
        </div>
      </div>
    </>
  );
};
