import { I18n } from "i18n-js";
import frTranslations from "translations/fr.json";

interface TranslationParams {
  [key: string]: string;
}

export default function useTranslate(translationContext: string) {
  const i18n = new I18n({
    fr: frTranslations,
  });

  i18n.defaultLocale = "fr";
  i18n.locale = "fr";

  return (key: string, params?: TranslationParams) => {
    return i18n.t(`ui.${translationContext}.${key}`, params);
  }
}
