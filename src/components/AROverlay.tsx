import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  translations: Record<string, string>;
}

interface AROverlayProps {
  objects: DetectedObject[];
  onPlayAudio: (text: string, language: string) => void;
  onSaveWord: (object: DetectedObject) => void;
  containerWidth: number;
  containerHeight: number;
  selectedLanguagePair?: {
    from: string;
    to: string;
    fromName: string;
    toName: string;
  };
}
const AROverlay: React.FC<AROverlayProps> = ({
  objects,
  onPlayAudio,
  onSaveWord,
  containerWidth,
  containerHeight,
  selectedLanguagePair
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getOverlayPosition = (boundingBox: DetectedObject['boundingBox']) => {
    const x = (boundingBox.left * containerWidth) / 100;
    const y = (boundingBox.top * containerHeight) / 100;
    const width = (boundingBox.width * containerWidth) / 100;
    const height = (boundingBox.height * containerHeight) / 100;

    return {
      left: Math.max(0, x),
      top: Math.max(0, y - 120), // Position above the object
      minWidth: Math.max(200, width)
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {objects.map((object) => {
        const position = getOverlayPosition(object.boundingBox);
        
        return (
          <div
            key={object.id}
            className="absolute pointer-events-auto"
            style={position}
          >
            {/* Bounding box indicator */}
            <div
              className="absolute border-2 border-blue-400 bg-blue-400 bg-opacity-20"
              style={{
                left: (object.boundingBox.left * containerWidth) / 100 - position.left,
                top: (object.boundingBox.top * containerHeight) / 100 - position.top + 120,
                width: (object.boundingBox.width * containerWidth) / 100,
                height: (object.boundingBox.height * containerHeight) / 100
              }}
            />
            
            {/* Translation overlay */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
              {/* Confidence indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${getConfidenceColor(object.confidence)}`}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {Math.round(object.confidence)}%
                </span>
              </div>

              {/* Source language name */}
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                {object.name}
              </div>

              {/* Dynamic translations based on selected language pair */}
              <div className="space-y-2">
                {selectedLanguagePair && (
                  <>
                    {/* Source language */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {selectedLanguagePair.fromName}
                        </div>
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {object.translations[selectedLanguagePair.from] || object.name}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-6 w-6"
                        onClick={() => onPlayAudio(
                          object.translations[selectedLanguagePair.from] || object.name, 
                          selectedLanguagePair.from
                        )}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Target language */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          {selectedLanguagePair.toName}
                        </div>
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">
                          {object.translations[selectedLanguagePair.to] || 'Translation not available'}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-6 w-6"
                        onClick={() => onPlayAudio(
                          object.translations[selectedLanguagePair.to] || object.name, 
                          selectedLanguagePair.to
                        )}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Save button */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => onSaveWord(object)}
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AROverlay;