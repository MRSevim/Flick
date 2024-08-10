"use client";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg, capitalizeFirstLetter } from "@/utils/HelperFuncs";
import links from "@/utils/Links";
import { Pagination } from "@mui/material";
import { Image } from "../Image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Follows = ({ type, json }) => {
  const users = json[type];
  const [darkMode] = useDarkModeContext();
  const page = json.currentPage;
  const totalPages = json.totalPages;
  const router = useRouter();

  const handlePaginationChange = (event, value) => {
    router.push(links.follows(json._id, type, value));
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <h2>{capitalizeFirstLetter(type)}</h2>
        {users.length ? (
          <>
            <div className="d-flex justify-content-center mb-3">
              <Pagination
                page={Number(page)}
                showFirstButton
                showLastButton
                count={totalPages}
                shape="rounded"
                onChange={handlePaginationChange}
              />
            </div>
            <div className="mb-4 row g-3 w-100">
              {users.map((user) => (
                <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                  <div className={"card " + addDarkBg(darkMode)}>
                    <div className="card-body d-flex align-items-center">
                      <Image
                        src={user.image}
                        classes={"profile-img-mini me-2"}
                      />
                      <Link
                        className="unstyled-link"
                        href={links.publicUser(user._id)}
                      >
                        <span className="card-title m-0 search-card-text h5">
                          {user.username}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h2 className="mb-4">
            {" "}
            <i className="bi bi-emoji-frown h1 me-2"></i>No users to display
          </h2>
        )}
      </div>
    </div>
  );
};
