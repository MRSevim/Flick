import { createContext, useState, useContext } from "react";
import ls from "localstorage-slim";

const UserContext = createContext(null);

const userLocalStorage = JSON.parse(ls.get("user"));

const userSessionStorage = JSON.parse(sessionStorage.getItem("user"))
  ? JSON.parse(sessionStorage.getItem("user"))
  : undefined;

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    userLocalStorage ? userLocalStorage : userSessionStorage
  );

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
