import React from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'translate', label: 'Translate', icon: '🔄' },
    { id: 'speak', label: 'Speak', icon: '🎤' },
    { id: 'camera', label: 'Camera', icon: '📷' },
    { id: 'learn', label: 'Learn', icon: '📚' },
    { id: 'wordbook', label: 'Wordbook', icon: '📖' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758383376017_86e4675c.webp" 
              alt="Lekker Ababili" 
              className="h-10 w-10 rounded-lg"
            />
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">Lekker Ababili</h1>
              <span className="text-lg">🇿🇦</span>
            </div>
            <p className="text-xs text-gray-600">Waar tale ontmoet</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-orange-800">🔥 7 Day Streak</span>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-800">⭐ 1,250 XP</span>
            </div>
            <button
              onClick={() => onTabChange('profile')}
              className={`p-2 rounded-full transition-colors ${
                activeTab === 'profile' ? 'bg-orange-100' : 'hover:bg-gray-100'
              }`}
              title="Profile"
            >
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
      </div>
      
      {activeTab !== 'profile' && (
        <nav className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;