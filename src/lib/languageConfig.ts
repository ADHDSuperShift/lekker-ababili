import { LanguagePair } from '../components/LanguageSelector';

export const SUPPORTED_LANGUAGE_PAIRS: LanguagePair[] = [
  // English pairs
  { from: 'en', to: 'es', fromName: 'English', toName: 'Spanish', flag: '🇺🇸→🇪🇸' },
  { from: 'en', to: 'fr', fromName: 'English', toName: 'French', flag: '🇺🇸→🇫🇷' },
  { from: 'en', to: 'de', fromName: 'English', toName: 'German', flag: '🇺🇸→🇩🇪' },
  { from: 'en', to: 'pt', fromName: 'English', toName: 'Portuguese', flag: '🇺🇸→🇵🇹' },
  { from: 'en', to: 'it', fromName: 'English', toName: 'Italian', flag: '🇺🇸→🇮🇹' },
  { from: 'en', to: 'af', fromName: 'English', toName: 'Afrikaans', flag: '🇺🇸→🇿🇦' },
  { from: 'en', to: 'zu', fromName: 'English', toName: 'Zulu', flag: '🇺🇸→🇿🇦' },
  
  // Spanish pairs
  { from: 'es', to: 'en', fromName: 'Spanish', toName: 'English', flag: '🇪🇸→🇺🇸' },
  { from: 'es', to: 'fr', fromName: 'Spanish', toName: 'French', flag: '🇪🇸→🇫🇷' },
  { from: 'es', to: 'pt', fromName: 'Spanish', toName: 'Portuguese', flag: '🇪🇸→🇵🇹' },
  
  // French pairs
  { from: 'fr', to: 'en', fromName: 'French', toName: 'English', flag: '🇫🇷→🇺🇸' },
  { from: 'fr', to: 'es', fromName: 'French', toName: 'Spanish', flag: '🇫🇷→🇪🇸' },
  { from: 'fr', to: 'de', fromName: 'French', toName: 'German', flag: '🇫🇷→🇩🇪' },
  
  // German pairs
  { from: 'de', to: 'en', fromName: 'German', toName: 'English', flag: '🇩🇪→🇺🇸' },
  { from: 'de', to: 'fr', fromName: 'German', toName: 'French', flag: '🇩🇪→🇫🇷' },
  
  // Portuguese pairs
  { from: 'pt', to: 'en', fromName: 'Portuguese', toName: 'English', flag: '🇵🇹→🇺🇸' },
  { from: 'pt', to: 'es', fromName: 'Portuguese', toName: 'Spanish', flag: '🇵🇹→🇪🇸' },
  
  // Original Afrikaans-Zulu pairs
  { from: 'af', to: 'zu', fromName: 'Afrikaans', toName: 'Zulu', flag: '🇿🇦→🇿🇦' },
  { from: 'zu', to: 'af', fromName: 'Zulu', toName: 'Afrikaans', flag: '🇿🇦→🇿🇦' }
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