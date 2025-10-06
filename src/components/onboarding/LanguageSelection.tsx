import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { storage } from '../../lib/storage';
const LanguageSelection: React.FC<LanguageSelectionProps> = ({ 
  step, 
  onLanguageSelect, 
  onBack 
}) => {
  const nativeLanguages = [
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'zu', name: 'Zulu', flag: '🇿🇦' }
  ];

  const targetLanguages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'zu', name: 'Zulu', flag: '🇿🇦' }
  ];

  const languages = step === 'native' ? nativeLanguages : targetLanguages;
  const title = step === 'native' ? 'Select your native language' : 'Choose language to learn';
  const subtitle = step === 'native' 
    ? 'What language do you speak?' 
    : 'Which language would you like to learn?';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="p-2">
              ←
            </Button>
          )}
          <div className="flex-1 text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: step === 'native' ? '33%' : '66%' }}
              />
            </div>
            <p className="text-sm text-gray-600">Step {step === 'native' ? '1' : '2'} of 3</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {title}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            {subtitle}
          </p>

          <div className="space-y-3">
            {languages.map((language) => (
              <Card
                key={language.code}
                className="p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                onClick={() => onLanguageSelect(language.code)}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{language.flag}</span>
                  <span className="text-lg font-medium text-gray-800">
                    {language.name}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;