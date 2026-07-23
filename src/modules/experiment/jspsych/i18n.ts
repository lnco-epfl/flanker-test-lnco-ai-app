import i18n from 'i18next';

import enTranslation from '../../../langs/en.json';
import frTranslation from '../../../langs/fr.json';

/**
 * @function getQueryParam
 * @description Retrieves the value of a specified query parameter from the URL. Current options are ?lang=en and ?lang=fr
 *
 * @param {string} param - The name of the query parameter to retrieve.
 * @returns {string | null} - The value of the query parameter, or null if not found.
 */
export const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Initialize i18next
const language = getQueryParam('lang') || 'en'; // Default to 'en' if not specified

// Initialize synchronously to ensure translations are available immediately
i18n.init({
  resources: {
    en: {
      translation: enTranslation.translations,
    },
    fr: {
      translation: frTranslation.translations,
    },
  },
  lng: language, // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  initImmediate: false, // Initialize synchronously
});

export default i18n;

// Supported narration languages — kept separate from i18next's resources
// config above since it's only used to enumerate audio file variants.
const NARRATION_LANGUAGES = ['en', 'fr'] as const;

// Single source of truth for narration clip base names. Each entry here
// must have a corresponding `assets/audio/<baseName>-<lang>.mp3` file for
// every language in NARRATION_LANGUAGES.
export const NARRATION_BASE_NAMES = [
  'flanker_instructions_page1',
  'flanker_instructions_page2',
  'flanker_instructions_page3',
  'flanker_practice_comprehension',
  'flanker_practice_repeat',
  'flanker_practice_result',
  'flanker_main_ready',
  'flanker_main_end',
] as const;

export type NarrationBaseName = (typeof NARRATION_BASE_NAMES)[number];

/**
 * @function getNarrationSrc
 * @description Builds the narration audio path for a base name in the
 * currently active i18n language (e.g. 'flanker_main_ready' -> 'assets/audio/flanker_main_ready-en.mp3').
 */
export const getNarrationSrc = (baseName: NarrationBaseName): string =>
  `assets/audio/${baseName}-${i18n.language}.mp3`;

/**
 * @function getAllNarrationSrcs
 * @description Lists every narration clip in every supported language, for
 * preloading before the settings-driven language has been applied.
 */
export const getAllNarrationSrcs = (): string[] =>
  NARRATION_BASE_NAMES.flatMap((baseName) =>
    NARRATION_LANGUAGES.map((lang) => `assets/audio/${baseName}-${lang}.mp3`),
  );
