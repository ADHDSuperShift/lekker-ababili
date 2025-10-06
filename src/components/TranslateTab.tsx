import React, { useState } from 'react';

const TranslateTab: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('af');
  const [targetLang, setTargetLang] = useState('zu');

  const languages = [
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ];

  const handleTranslate = () => {
    // Mock translation for demo
    const translations: Record<string, string> = {
      'hello': sourceLang === 'af' ? 'sawubona' : 'hallo',
      'goodbye': sourceLang === 'af' ? 'sala kahle' : 'totsiens',
      'thank you': sourceLang === 'af' ? 'ngiyabonga' : 'dankie'
    };
    
    const result = translations[sourceText.toLowerCase()] || `Translated: ${sourceText}`;
    setTranslatedText(result);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Universal Translator</h2>
          <p className="opacity-90">Bridge languages, connect cultures</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={swapLanguages}
              className="mx-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              🔄
            </button>
            
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleTranslate}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Translate
              </button>
            </div>
            
            <div>
              <div className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800">{translatedText || 'Translation will appear here...'}</p>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  🔊 Play
                </button>
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  📖 Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslateTab;