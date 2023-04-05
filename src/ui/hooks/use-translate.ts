import { I18n } from "i18n-js";
import translations from "common/translations.json";

interface TranslationParams {
  [key: string]: string;
}

export default function useTranslate(translationContext: string) {
  const i18n = new I18n({
    fr: translations,
  });

  i18n.defaultLocale = "fr";
  i18n.locale = "fr";

  return (key: string, params?: TranslationParams) => {
    return i18n.t(`ui.${translationContext}.${key}`, params);
  }
}
