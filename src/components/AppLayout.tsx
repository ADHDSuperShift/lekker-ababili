import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Lekker Ababili</h1>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Learn</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Practice</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Leer Tale in Afrikaans �</h2>
          <p className="text-xl mb-8">Learn any language with lessons, AR translation, and AI tutoring - all taught in Afrikaans</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Begin Leer / Start Learning
          </button>
        </div>
      </section>

      {/* Main Content - Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="speak">Speak</TabsTrigger>
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="wordbook">Wordbook</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
          </TabsList>
          
          <TabsContent value="learn" className="mt-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Leergeleenthede / Learning Center</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🇬🇧 English</h4>
                  <p className="text-gray-600 mb-4">Leer Engels in Afrikaans</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Begin Les
                  </button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🇪🇸 Spanish</h4>
                  <p className="text-gray-600 mb-4">Leer Spaans in Afrikaans</p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                    Begin Les
                  </button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🇿🇦 Zulu</h4>
                  <p className="text-gray-600 mb-4">Leer Zulu in Afrikaans</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Begin Les
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="speak" className="mt-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Voice Practice</h3>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl hover:bg-blue-700 cursor-pointer">
                  🎤
                </div>
                <p className="text-lg">Tap to practice pronunciation</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="translate" className="mt-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Universal Translator</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <textarea 
                    placeholder="Enter text to translate..."
                    className="w-full h-32 p-4 border rounded-lg resize-none"
                  />
                  <button className="mt-3 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                    Translate
                  </button>
                </div>
                <div>
                  <div className="w-full h-32 p-4 bg-gray-50 border rounded-lg">
                    <p className="text-gray-600">Translation will appear here...</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wordbook" className="mt-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">My Wordbook</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { af: 'Hallo', zu: 'Sawubona', en: 'Hello' },
                  { af: 'Dankie', zu: 'Ngiyabonga', en: 'Thank you' },
                  { af: 'Vriend', zu: 'Umngane', en: 'Friend' }
                ].map((word, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <p><strong>AF:</strong> {word.af}</p>
                      <p><strong>ZU:</strong> {word.zu}</p>
                      <p><strong>EN:</strong> {word.en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="camera" className="mt-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Camera Translator</h3>
              <div className="text-center">
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div>
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-gray-600 mb-4">Point camera at text to translate</p>
                    <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700">
                      📸 Capture Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Lekker Ababili. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;