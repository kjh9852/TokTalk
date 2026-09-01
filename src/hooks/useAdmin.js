import { useContext } from "react";

import AdminContext from "@/context/admin/AdminContext";

export default function useAdmin() {
  return useContext(AdminContext);
}
