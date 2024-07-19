import { useUserContext } from "@/contexts/UserContext";
import { DarkModeToggle } from "./DarkModeToggle";
import Link from "next/link";
import links from "@/utils/Links";
import { Image } from "../Image";
import { UserMenu } from "./UserMenu";
import { useEffect, useRef, useState } from "react";
import { logoutCall } from "@/utils/ApiCalls/UserApiFunctionsOnClient";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { usePathname, useRouter } from "next/navigation";

const RightSide = () => {
  const [user, setUser] = useUserContext();
  const [userMenu, setUserMenu] = useState(false);
  const wrapperRef = useRef(null);
  const [, setGlobalError] = useGlobalErrorContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setUserMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const logOut = async () => {
    const error = await logoutCall(pathname, router);
    if (error) {
      setGlobalError(error);
      return;
    }
    setUser(undefined);
    setUserMenu(false);
  };
  return (
    <>
      {!user && <DarkModeToggle />}
      {/*  {user && (
        <>
          <PmIcon />
          <Notifications />
        </>
      )} */}
      {user ? (
        <div ref={wrapperRef} className="position-relative">
          <div
            onClick={() => {
              setUserMenu((prev) => !prev);
            }}
            className="text-end pointer"
          >
            <Image src={user.image} classes={"profile-img-mini"} />
          </div>
          {userMenu && (
            <UserMenu setUserMenu={setUserMenu} logOut={logOut} user={user} />
          )}
        </div>
      ) : (
        <div className="text-end user-container">
          <Link href={links.login}>
            <button type="button" className="btn btn-outline-light me-2">
              Login
            </button>
          </Link>
          <Link href={links.signup()}>
            <button type="button" className="btn btn-secondary">
              Sign-up
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default RightSide;
