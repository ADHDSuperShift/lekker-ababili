import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import LanguageSelection from './LanguageSelection';
import AccountCreation from './AccountCreation';
import FreeTrialScreen from './FreeTrialScreen';
import { storage } from '../../lib/storage';

type OnboardingStep = 'splash' | 'native' | 'target' | 'account' | 'trial';

const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');
  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState<string>('');
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<string>('');

  const handleSplashComplete = () => {
    setCurrentStep('native');
  };

  const handleNativeLanguageSelect = (language: string) => {
    const languageMap: { [key: string]: string } = {
      'af': 'Afrikaans',
      'zu': 'Zulu',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese'
    };
    
    setSelectedNativeLanguage(languageMap[language] || language);
    setCurrentStep('target');
  };

  const handleTargetLanguageSelect = (language: string) => {
    const languageMap: { [key: string]: string } = {
      'af': 'Afrikaans',
      'zu': 'Zulu',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese'
    };
    
    setSelectedTargetLanguage(languageMap[language] || language);
    
    // Save language preferences
    storage.saveLanguagePreferences(
      languageMap[selectedNativeLanguage] || selectedNativeLanguage,
      languageMap[language] || language
    );
    
    setCurrentStep('account');
  };

  const handleAccountCreated = () => {
    setCurrentStep('trial');
  };

  const handleTrialStart = () => {
    storage.setOnboardingComplete(true);
    onComplete();
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'target':
        setCurrentStep('native');
        break;
      case 'account':
        setCurrentStep('target');
        break;
      case 'trial':
        setCurrentStep('account');
        break;
      default:
        break;
    }
  };
  switch (currentStep) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    case 'native':
      return (
        <LanguageSelection
          step="native"
          onLanguageSelect={handleNativeLanguageSelect}
        />
      );
    case 'target':
      return (
        <LanguageSelection
          step="target"
          onLanguageSelect={handleTargetLanguageSelect}
          onBack={handleBack}
        />
      );
    case 'account':
      return (
        <AccountCreation
          onComplete={handleAccountCreated}
          onBack={handleBack}
        />
      );
    case 'trial':
      return <FreeTrialScreen onStartTrial={handleTrialStart} />;
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
};

export default OnboardingFlow;