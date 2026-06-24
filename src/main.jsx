import ModalProvider from "@/context/ModalContextProvider.jsx";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import LanguageProvider from "./context/LanguageContextProvider.jsx";
import PostContextProdiver from "./context/PostContext.jsx";
import UserProvider from "./context/UserContextProvider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ModalProvider>
    <PostContextProdiver>
      <AdminContextProvider>
        <LanguageProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </LanguageProvider>
      </AdminContextProvider>
    </PostContextProdiver>
  </ModalProvider>,
);
