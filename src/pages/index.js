import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Homepage() {
  const router = useRouter();
  const [searchIp, setSearchIp] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from system preference and localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSearch = () => {
    if (searchIp.trim()) {
      const trimmedIp = searchIp.trim();
      router.push(`/server/${encodeURIComponent(trimmedIp)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleExampleServer = (serverName) => {
    setSearchIp(serverName);
    router.push(`/server/${encodeURIComponent(serverName)}`);
  };

  const popularServers = [
    { name: 'play.hypixel.net', description: 'Most popular Minecraft server' },
    { name: 'mc.mineplex.com', description: 'Classic minigames network' },
    { name: 'play.cubecraft.net', description: 'Cube games and competitions' },
    { name: 'mineheroes.org', description: 'RPG and adventure server' }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-all duration-300 ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>M</span>
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                McStatus.eu
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="/" className={`font-medium transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Home
                </a>
                <a href="#" className={`font-medium transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  API
                </a>
                <a href="#" className={`font-medium transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Help
                </a>
              </nav>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className={`mb-8`}>
            <h2 className={`text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Minecraft Server Status
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Check the status of any Minecraft server instantly. See who's online, server version, and more.
            </p>
          </div>

          {/* Search Section */}
          <div className={`rounded-2xl p-8 mb-12 transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="max-w-2xl mx-auto">
              <label htmlFor="serverSearch" className={`block text-lg font-semibold mb-4 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Enter Server Address
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  id="serverSearch"
                  value={searchIp}
                  onChange={(e) => setSearchIp(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g. play.hypixel.net or 192.168.1.100:25565"
                  className={`flex-1 px-6 py-4 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button 
                  onClick={handleSearch}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                >
                  Check Status
                </button>
              </div>
            </div>
          </div>

          {/* Popular Servers */}
          <div className="mb-16">
            <h3 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Popular Servers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularServers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleServer(server.name)}
                  className={`p-6 rounded-xl text-left transition-all duration-300 hover:shadow-lg ${
                    darkMode 
                      ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750' 
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {server.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {server.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${
                darkMode ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Real-time Status
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get instant updates on server status, player count, and connectivity
              </p>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${
                darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Player Information
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                See who's online with player avatars and detailed server information
              </p>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${
                darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Lightning Fast
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Quick server checks with detailed results in seconds
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t transition-all duration-300 ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>M</span>
              </div>
              <span className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                McStatus.eu
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className={`text-sm mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                © 2025 McStatus.eu
              </p>
              <div className="flex space-x-6 justify-center md:justify-end">
                <a href="#" className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}>
                  Privacy
                </a>
                <a href="#" className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}>
                  Terms
                </a>
                <a href="#" className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}>
                  API
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
