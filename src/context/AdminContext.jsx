import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export default function AdminContextProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
