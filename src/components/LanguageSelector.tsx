import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Languages, ArrowRight } from 'lucide-react';

export interface LanguagePair {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  flag: string;
}

interface LanguageSelectorProps {
  selectedPair: LanguagePair;
  onPairChange: (pair: LanguagePair) => void;
  availablePairs: LanguagePair[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedPair,
  onPairChange,
  availablePairs
}) => {
  const handlePairSelection = (pairId: string) => {
    const pair = availablePairs.find(p => `${p.from}-${p.to}` === pairId);
    if (pair) {
      onPairChange(pair);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Languages className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Translation Language Pair
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={`${selectedPair.from}-${selectedPair.to}`}
            onValueChange={handlePairSelection}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedPair.flag}</span>
                  <span>{selectedPair.fromName}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span>{selectedPair.toName}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availablePairs.map((pair) => (
                <SelectItem key={`${pair.from}-${pair.to}`} value={`${pair.from}-${pair.to}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pair.flag}</span>
                    <span>{pair.fromName}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span>{pair.toName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Objects will be detected in <strong>{selectedPair.fromName}</strong> and 
            translated to <strong>{selectedPair.toName}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;