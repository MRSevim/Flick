import { createContext, useState, useContext } from "react";
import ls from "localstorage-slim";

const UserContext = createContext(null);

const userStorage = JSON.parse(ls.get("user"));

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(userStorage ? userStorage : undefined);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
