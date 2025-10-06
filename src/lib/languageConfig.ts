import { LanguagePair } from '../components/LanguageSelector';

export const SUPPORTED_LANGUAGE_PAIRS: LanguagePair[] = [
  // Afrikaans speakers learning other languages (Teaching Language: Afrikaans)
  { from: 'af', to: 'en', fromName: 'Afrikaans', toName: 'English', flag: '��→��' },
  { from: 'af', to: 'es', fromName: 'Afrikaans', toName: 'Spanish', flag: '��→��' },
  { from: 'af', to: 'fr', fromName: 'Afrikaans', toName: 'French', flag: '��→��' },
  { from: 'af', to: 'de', fromName: 'Afrikaans', toName: 'German', flag: '��→��' },
  { from: 'af', to: 'pt', fromName: 'Afrikaans', toName: 'Portuguese', flag: '��→🇵🇹' },
  { from: 'af', to: 'it', fromName: 'Afrikaans', toName: 'Italian', flag: '��→��' },
  { from: 'af', to: 'zu', fromName: 'Afrikaans', toName: 'Zulu', flag: '��→��' },
  { from: 'af', to: 'xh', fromName: 'Afrikaans', toName: 'Xhosa', flag: '��→��' },
  { from: 'af', to: 'zh', fromName: 'Afrikaans', toName: 'Chinese', flag: '��→��' },
  { from: 'af', to: 'ja', fromName: 'Afrikaans', toName: 'Japanese', flag: '��→��' },
  { from: 'af', to: 'ko', fromName: 'Afrikaans', toName: 'Korean', flag: '��→��' },
  { from: 'af', to: 'ar', fromName: 'Afrikaans', toName: 'Arabic', flag: '��→🇸🇦' },
  { from: 'af', to: 'ru', fromName: 'Afrikaans', toName: 'Russian', flag: '🇿🇦→��' },
  { from: 'af', to: 'nl', fromName: 'Afrikaans', toName: 'Dutch', flag: '🇿🇦→��' }
];

export const LANGUAGE_VOICES = {
  'en': ['Joanna', 'Matthew', 'Amy', 'Brian'],
  'es': ['Conchita', 'Enrique', 'Lucia', 'Miguel'],
  'fr': ['Celine', 'Mathieu', 'Lea', 'Remy'],
  'de': ['Marlene', 'Hans', 'Vicki', 'Daniel'],
  'pt': ['Ines', 'Ricardo', 'Cristiano', 'Camila'],
  'it': ['Carla', 'Giorgio', 'Bianca', 'Adriano'],
  'af': ['Ayanda', 'Willem', 'Susan', 'Johan'],
  'zu': ['Nomsa', 'Sipho', 'Thandi', 'Mandla']
};

export const LANGUAGE_CODES = {
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'pt': 'pt-PT',
  'it': 'it-IT',
  'af': 'af-ZA',
  'zu': 'zu-ZA'
};

export const getDefaultLanguagePair = (): LanguagePair => {
  return SUPPORTED_LANGUAGE_PAIRS[0]; // English to Spanish as default
};

export const getLanguageCode = (lang: string): string => {
  return LANGUAGE_CODES[lang] || 'en-US';
};

export const getAvailableVoices = (lang: string): string[] => {
  return LANGUAGE_VOICES[lang] || ['default'];
};