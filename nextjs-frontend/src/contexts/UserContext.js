"use client";
import { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const UserContext = createContext(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, userFromCookies }) => {
  const [user, setUser] = useState(userFromCookies);
  const router = useRouter();

  const changeUser = (user, rememberMe) => {
    if (!user) {
      Cookies.remove("user");
      Cookies.remove("expirationDateOfUser");
      setUser(undefined);
      return;
    }
    const userString = JSON.stringify(user);
    if (rememberMe) {
      Cookies.set("user", userString, { expires: 30 });
      let date = new Date();
      date.setDate(date.getDate() + 30);
      const utcDate = date.toUTCString();
      Cookies.set("expirationDateOfUser", utcDate, { expires: 30 });
    } else {
      const expirationDate = Cookies.get("expirationDateOfUser");
      if (expirationDate) {
        document.cookie = "user=" + userString + "; expires=" + expirationDate;
      } else {
        Cookies.set("user", userString);
      }
    }

    /*  router.refresh(); */
    setUser(user);
  };

  return (
    <UserContext.Provider value={[user, changeUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
