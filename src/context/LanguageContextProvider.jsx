import { createContext, useContext, useState } from "react";

import { translations } from "../translations/translations";

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ko");
  const [isOn, setIsOn] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
    setIsOn(() => (language === "ko" ? true : false));
    console.log(isOn);
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, isOn, setIsOn }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  const t = translations[ctx.language];
  return { ...ctx, t };
}
