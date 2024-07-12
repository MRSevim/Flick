"use client";
import { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";
const UserContext = createContext(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, userFromCookies }) => {
  const [user, setUser] = useState(userFromCookies);

  const changeUser = (user, rememberMe) => {
    if (!user) {
      Cookies.remove("user");
      setUser(undefined);
      return;
    }
    if (rememberMe) {
      Cookies.set("user", JSON.stringify(user), { expires: 30 });
    } else {
      Cookies.set("user", JSON.stringify(user));
    }
    setUser(user);
  };

  return (
    <UserContext.Provider value={[user, changeUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
