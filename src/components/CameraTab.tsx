import React, { useState } from 'react';

const CameraTab: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateCapture = () => {
    setIsProcessing(true);
    // Simulate camera capture and OCR processing
    setTimeout(() => {
      setCapturedImage('https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758383378315_403cd9ea.webp');
      setDetectedText('Welkom by ons restaurant');
      setTranslatedText('Welcome to our restaurant');
      setIsProcessing(false);
    }, 2000);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setDetectedText('');
    setTranslatedText('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Camera Translator</h2>
          <p className="opacity-90">Point, shoot, understand</p>
        </div>
        
        <div className="p-6">
          {!capturedImage ? (
            <div className="text-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-600 mb-4">Point your camera at text to translate</p>
                  <button
                    onClick={simulateCapture}
                    disabled={isProcessing}
                    className={`px-8 py-3 rounded-lg text-white font-medium transition-colors ${
                      isProcessing 
                        ? 'bg-gray-400' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : '📸 Capture Text'}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">🍽️</div>
                  <h3 className="font-semibold text-blue-800">Menus</h3>
                  <p className="text-sm text-blue-600">Restaurant menus & food items</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">🚏</div>
                  <h3 className="font-semibold text-green-800">Signs</h3>
                  <p className="text-sm text-green-600">Street signs & directions</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl mb-2">📄</div>
                  <h3 className="font-semibold text-orange-800">Documents</h3>
                  <p className="text-sm text-orange-600">Forms & official papers</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured text" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">Text detected and translated</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-2">Detected Text (Afrikaans):</h3>
                <p className="text-blue-700 text-lg">{detectedText}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">Translation (English):</h3>
                <p className="text-green-700 text-lg">{translatedText}</p>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  📖 Save Translation
                </button>
                <button 
                  onClick={resetCapture}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  📸 New Capture
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📱 Camera Tips:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Hold steady and ensure good lighting</li>
              <li>• Keep text horizontal and in focus</li>
              <li>• Works best with printed text (not handwriting)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraTab;