import Link from "next/link";
import links from "@/utils/Links";
import { addDarkBg } from "@/utils/HelperFuncs";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { DarkModeToggle } from "./DarkModeToggle";

export const UserMenu = ({ setUserMenu, logOut, user }) => {
  const [darkMode] = useDarkModeContext();
  return (
    <div
      className={
        "user-menu-container rounded border bg-light position-absolute " +
        addDarkBg(darkMode)
      }
    >
      <div>
        <p className="p-2 m-0 border-bottom text-center text-break">
          {user.username}
        </p>
        <Link
          href={links.myProfile}
          className="unstyled-link"
          onClick={() => {
            setUserMenu(false);
          }}
        >
          <p className="m-0 p-2 text-center usermenu-link">My Profile</p>
        </Link>
      </div>
      <Link
        href={links.allArticles(user._id)}
        className="unstyled-link"
        onClick={() => {
          setUserMenu(false);
        }}
      >
        <p className="m-0 p-2 text-center usermenu-link">My Articles</p>
      </Link>
      <Link
        href={links.settings}
        className="unstyled-link"
        onClick={() => {
          setUserMenu(false);
        }}
      >
        <p className="m-0 p-2 text-center usermenu-link">Settings</p>
      </Link>
      <div className="m-0 d-flex justify-content-center">
        <DarkModeToggle />
      </div>
      <p className="m-0 p-2 text-center usermenu-link pointer" onClick={logOut}>
        Logout
      </p>
    </div>
  );
};
