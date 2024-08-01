import { I18n } from 'i18n-js';

const translations = {
  components: {
    'keyboard-shortcut': {
      'GOTO_NEXT': 'Aller au prochain personnage',
      'GOTO_PREVIOUS': 'Aller au personnage précédent',
      'GOTO_1': 'Aller au personnage 1',
      'GOTO_2': 'Aller au personnage 2',
      'GOTO_3': 'Aller au personnage 3',
      'GOTO_4': 'Aller au personnage 4',
      'GOTO_5': 'Aller au personnage 5',
      'GOTO_6': 'Aller au personnage 6',
      'GOTO_7': 'Aller au personnage 7',
      'GOTO_8': 'Aller au personnage 8',
      'not-set': 'Aucun raccourci',
    },
  },
  dashboard: {
    'change-team': "Changer d'équipe",
    'add-character': 'Ajouter un personnage',
  },
  settings: {
    characters: {
      title: 'Personnages',
      character: 'Personnage',
      new: 'Nouveau personnage',
      form: {
        'name': 'Nom',
        'name-help': 'Doit corespondre au nom de la fenêtre Dofus',
        'save': 'Sauvegarder',
        'cancel': 'Annuler',
      },
    },
    teams: {
      title: 'Équipes',
      team: 'Équipe',
      new: 'Nouvelle équipe',
      form: {
        'name': 'Nom',
        'add-character': 'Ajouter un personnage',
        'save': 'Sauvegarder',
        'cancel': 'Annuler',
      },
    },
    shortcuts: {
      'title': 'Raccourcis',
      'current-team': 'Équipe active',
      'teams': 'Équipes',
      'characters': 'Personnages',
    },
  },
};

interface TranslationParams {
  [key: string]: string;
}

export default function useTranslate(translationContext: string) {
  const i18n = new I18n({
    fr: translations,
  });

  i18n.defaultLocale = 'fr';
  i18n.locale = 'fr';

  return (key: string, params?: TranslationParams) => {
    return i18n.t(`${translationContext}.${key}`, params);
  };
}
