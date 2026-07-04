import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import LanguageProvider from "./context/LanguageContextProvider.jsx";
import PostContextProdiver from "./context/PostContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PostContextProdiver>
    <AdminContextProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AdminContextProvider>
  </PostContextProdiver>,
);
