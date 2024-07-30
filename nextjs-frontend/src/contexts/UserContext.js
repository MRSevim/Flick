"use client";
import { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";
const UserContext = createContext(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, userFromCookies }) => {
  const [user, setUser] = useState(userFromCookies);

  const changeUser = async (user, rememberMe) => {
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
    /*Have to check if cookies are set, since cookie setting is async*/
    const cookiesAreSet = () =>
      new Promise((resolve) => {
        const checkCookies = setInterval(() => {
          if (Cookies.get("user")) {
            clearInterval(checkCookies);
            setUser(user);
            resolve(Cookies.get("user"));
          }
        }, 50);
      });

    return cookiesAreSet();
  };

  return (
    <UserContext.Provider value={[user, changeUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
