import React, { useState } from 'react';
import { TTSPlayer } from './TTSPlayer';

const WordbookTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const savedWords = [
    { id: 1, afrikaans: 'Hallo', zulu: 'Sawubona', english: 'Hello', category: 'greetings', difficulty: 'easy' },
    { id: 2, afrikaans: 'Dankie', zulu: 'Ngiyabonga', english: 'Thank you', category: 'greetings', difficulty: 'easy' },
    { id: 3, afrikaans: 'Restaurant', zulu: 'Indawo yokudlela', english: 'Restaurant', category: 'food', difficulty: 'medium' },
    { id: 4, afrikaans: 'Hospitaal', zulu: 'Isibhedlela', english: 'Hospital', category: 'places', difficulty: 'medium' },
    { id: 5, afrikaans: 'Vriend', zulu: 'Umngane', english: 'Friend', category: 'relationships', difficulty: 'easy' },
    { id: 6, afrikaans: 'Onderwys', zulu: 'Imfundo', english: 'Education', category: 'academic', difficulty: 'hard' }
  ];

  const categories = [
    { id: 'all', name: 'All Words', count: savedWords.length },
    { id: 'greetings', name: 'Greetings', count: 2 },
    { id: 'food', name: 'Food & Dining', count: 1 },
    { id: 'places', name: 'Places', count: 1 },
    { id: 'relationships', name: 'Relationships', count: 1 },
    { id: 'academic', name: 'Academic', count: 1 }
  ];

  const filteredWords = savedWords.filter(word => {
    const matchesSearch = word.afrikaans.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.zulu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.english.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-green-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">My Wordbook</h2>
          <p className="opacity-90">Your personal vocabulary collection</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search your saved words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredWords.map((word) => (
              <div key={word.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                    {word.difficulty}
                  </span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    🗑️
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Afrikaans</span>
                    <p className="font-semibold text-gray-900">{word.afrikaans}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Zulu</span>
                    <p className="font-semibold text-blue-700">{word.zulu}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">English</span>
                    <p className="font-medium text-gray-700">{word.english}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <TTSPlayer 
                    text={word.afrikaans}
                    language="af"
                    className="text-xs"
                  />
                  <TTSPlayer 
                    text={word.zulu}
                    language="zu"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {filteredWords.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No words found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Total Words</span>
                  <span className="font-bold text-blue-800">{savedWords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Mastered</span>
                  <span className="font-bold text-green-600">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Learning</span>
                  <span className="font-bold text-yellow-600">2</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">🎯 Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                  📝 Add New Word
                </button>
                <button className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                  🧠 Practice All Words
                </button>
                <button className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  📤 Export Wordbook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordbookTab;