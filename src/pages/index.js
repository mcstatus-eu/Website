import { useState } from 'react';

export default function Home() {
  const [serverIp, setServerIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    if (!serverIp.trim()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Checking server: ${serverIp.trim()}`);
    }, 2000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              McStatus.eu
            </h1>
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-6 md:space-x-8">
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Home
                </a>
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  API
                </a>
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Help
                </a>
              </nav>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
      <main className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center pt-24 pb-20">
          <h2 className={`text-6xl font-light mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Minecraft Server Status
          </h2>
          <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Check if your Minecraft server is online quickly and easily, and get detailed information.
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-32">
          <div className={`rounded-2xl p-8 shadow-xl transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ip" className={`block text-sm font-medium mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Server IP Address
                </label>
                <input 
                  type="text" 
                  id="ip" 
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                  placeholder="e.g. play.hypixel.net or 192.168.1.100:25565"
                  className={`w-full px-4 py-4 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                  }`}
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                  } ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Checking...</span>
                    </div>
                  ) : (
                    'Check Status'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${
        darkMode 
          ? 'border-gray-800 bg-gray-800' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                McStatus.eu
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className={`text-sm mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                © 2025 McStatus.eu
              </p>
              <div className="flex space-x-6 justify-center md:justify-end">
                <a href="#" className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}>
                  Privacy
                </a>
                <a href="#" className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}>
                  Terms
                </a>
                <a href="#" className={`text-sm transition-colors duration-300 ${
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
