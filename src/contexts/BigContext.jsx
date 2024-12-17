import { createContext, useContext, useState } from "react";
/*eslint-disable*/
const BigContext = createContext();
function BigProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = { user, setUser };
  return <BigContext.Provider value={value}>{children}</BigContext.Provider>;
}
function useBig() {
  const context = useContext(BigContext);
  if (context === undefined)
    throw new Error("Context is used outside of BigProvider Component");
  return context;
}
export { BigProvider, useBig };
