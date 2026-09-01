import { useState } from "react";

import LanguageContext from "@/context/language/LanguageContext";

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ko");
  const isOn = language === "en";

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isOn }}>
      {children}
    </LanguageContext.Provider>
  );
}
