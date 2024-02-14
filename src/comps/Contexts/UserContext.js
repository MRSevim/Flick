import { createContext, useState, useContext, useEffect } from "react";
import ls from "localstorage-slim";

const UserContext = createContext(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(ls.get("username"));

    if (user) {
      setUser(user);
    } else {
      setUser(undefined);
    }
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
