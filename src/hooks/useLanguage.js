import { useContext } from "react";

import LanguageContext from "@/context/language/LanguageContext";
import { translations } from "@/translations/translations";

export default function useLanguage() {
  const ctx = useContext(LanguageContext);
  const t = translations[ctx.language];
  return { ...ctx, t };
}
