import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Lekker Ababili</h1>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Leer</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Oefen</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Profiel</a>
            </nav>
          </div>
        </div>
      </header>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Leer Tale in Afrikaans 🌍</h2>
          <p className="text-xl mb-8">Leer enige taal met lesse, AR-vertaling, en KI-tutorering - alles in Afrikaans</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Begin Leer</button>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="learn">Leer</TabsTrigger>
            <TabsTrigger value="speak">Praat</TabsTrigger>
            <TabsTrigger value="translate">Vertaal</TabsTrigger>
            <TabsTrigger value="wordbook">Woordeboek</TabsTrigger>
            <TabsTrigger value="camera">Kamera</TabsTrigger>
          </TabsList>
          <TabsContent value="learn" className="mt-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Leergeleenthede</h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">🇬🇧 Engels</h4>
                  <p className="text-gray-600 mb-4">Leer Engels in Afrikaans</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">🇪🇸 Spaans</h4>
                  <p className="text-gray-600 mb-4">Leer Spaans in Afrikaans</p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">🇫🇷 Frans</h4>
                  <p className="text-gray-600 mb-4">Leer Frans in Afrikaans</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">🇩🇪 Duits</h4>
                  <p className="text-gray-600 mb-4">Leer Duits in Afrikaans</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">🇨🇳 Chinees</h4>
                  <p className="text-gray-600 mb-4">Leer Chinees in Afrikaans</p>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">��🇹 Italiaans</h4>
                  <p className="text-gray-600 mb-4">Leer Italiaans in Afrikaans</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2">🇿🇦 Zulu</h4>
                  <p className="text-gray-600 mb-4">Leer Zulu in Afrikaans</p>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full">Begin Les</button>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-50">
                  <h4 className="font-semibold mb-2">➕ Meer Tale</h4>
                  <p className="text-gray-600 mb-4">Portugees, Japannees, Koreaans & meer</p>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full">Bekyk Almal</button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Lekker Ababili. Alle regte voorbehou.</p>
        </div>
      </footer>
    </div>
  );
}
