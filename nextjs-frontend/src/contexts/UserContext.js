"use client";
import { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, userFromCookies }) => {
  const [user, setUser] = useState(userFromCookies);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
