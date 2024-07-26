"use client";
import links from "@/utils/Links";
import Link from "next/link";
import { Image } from "../Image";
import { AdvancedSearch } from "../AdvancedSearch";
import { LikeButton } from "../LikeButton";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg } from "@/utils/HelperFuncs";

export const Search = ({ json }) => {
  const articles = json.articles;
  const users = json.users;
  const [darkMode] = useDarkModeContext();

  return (
    <div className="container">
      <AdvancedSearch />
      <>
        <h2>Users</h2>
        {users?.length ? (
          <div className="mb-4 row g-3">
            {users.map((user) => (
              <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                <div className={"card " + addDarkBg(darkMode)}>
                  <div className="card-body d-flex align-items-center">
                    <Image src={user.image} classes={"profile-img-mini me-2"} />
                    <Link
                      className="unstyled-link"
                      href={links.publicUser(user._id)}
                    >
                      <h5 className="card-title m-0 search-card-text">
                        {user.username}
                      </h5>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4">No users to display</div>
        )}
        <h2>Articles</h2>
        {articles?.length ? (
          <div className="pb-4 row g-3">
            {articles.map((article) => (
              <div key={article._id} className="col col-12 col-md-6 col-lg-4">
                <div
                  className={
                    "card text-info " +
                    addDarkBg(darkMode) +
                    (darkMode && " text-white")
                  }
                >
                  <div className="card-body">
                    <span className="line-right ">
                      <LikeButton
                        classes="p-1 m-1 bg-secondary"
                        article={article}
                      />
                    </span>
                    {article.tags.map((tag, i) => (
                      <Link href={links.tag(tag)} key={i} className="me-1">
                        #{tag}
                      </Link>
                    ))}
                    <p className="my-2">
                      <Link
                        className="unstyled-link"
                        href={links.article(article._id)}
                      >
                        <span className="card-title m-0 search-card-text">
                          {article.title}
                        </span>
                      </Link>
                    </p>
                    <div>
                      written by
                      <Link
                        className="fw-bold ms-1"
                        href={links.publicUser(article.user._id)}
                      >
                        {article.user.username}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4">No articles to display</div>
        )}
      </>
    </div>
  );
};
