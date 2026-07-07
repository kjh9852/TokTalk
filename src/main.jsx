import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import LanguageProvider from "./context/LanguageContextProvider.jsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AdminContextProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AdminContextProvider>
  </QueryClientProvider>,
);
