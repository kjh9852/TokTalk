import { useState } from "react";

import AdminContext from "@/context/admin/AdminContext";

export default function AdminContextProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
