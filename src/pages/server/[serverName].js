import { useState, useEffect } from 'react';

export default function ServerStatus() {
  const [serverName, setServerName] = useState('play.extremecraft.net');
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchIp, setSearchIp] = useState('play.extremecraft.net');
  const [darkMode, setDarkMode] = useState(false);

  // Fetch server data from McStatus.eu API
  const fetchServerData = async (serverAddress) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.mcstatus.io/v2/java/${encodeURIComponent(serverAddress)}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the API response to match our component structure
      const transformedData = {
        online: data.online,
        timestamp: new Date().toISOString(),
        players: {
          online: data.players?.online || 0,
          max: data.players?.max || 0,
          list: data.players?.list || null
        },
        version: {
          name: data.version?.name_clean || data.version?.name_raw || 'Unknown',
          protocol: data.version?.protocol || 0
        },
        motd: {
          clean: data.motd?.clean || 'No MOTD available'
        },
        favicon: data.icon || null
      };
      
      setServerData(transformedData);
    } catch (err) {
      console.error('Error fetching server data:', err);
      setError(err.message || 'Failed to fetch server status');
      setServerData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load initial server data
  useEffect(() => {
    fetchServerData(serverName);
  }, []);

  const handleSearch = () => {
    if (searchIp.trim()) {
      setServerName(searchIp.trim());
      fetchServerData(searchIp.trim());
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className={`text-2xl font-bold transition-colors duration-300 hover:text-blue-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              McStatus.eu
            </a>
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-6 md:space-x-8">
                <a href="/" className={`transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Form */}
        <div className={`rounded-2xl p-6 shadow-xl mb-8 transition-all duration-300 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="ip" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Check another server
              </label>
              <input 
                type="text" 
                id="ip" 
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g. play.hypixel.net or 192.168.1.100:25565"
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Server Status: {serverName}
          </h1>
          {serverData && !loading && (
            <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last checked: {new Date(serverData.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`rounded-2xl p-8 text-center shadow-xl transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Checking server status...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Server Data */}
        {serverData && !loading && (
          <>
            {/* Status Alert */}
            {serverData.online ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-green-800 font-semibold text-lg">
                    Server is online and accepting connections
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-red-800 font-semibold text-lg">
                    Server is offline or unreachable
                  </span>
                </div>
              </div>
            )}

            {serverData.online && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Server Details */}
                <div className={`rounded-2xl p-8 shadow-xl transition-all duration-300 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Server Information
                  </h2>
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center py-4 border-b transition-colors duration-300 ${
                      darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <span className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Status:
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Online
                      </span>
                    </div>
                    <div className={`flex justify-between items-center py-4 border-b transition-colors duration-300 ${
                      darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <span className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Players:
                      </span>
                      <span className={`font-bold text-2xl transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {serverData.players.online.toLocaleString()}/{serverData.players.max.toLocaleString()}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center py-4 border-b transition-colors duration-300 ${
                      darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <span className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Version:
                      </span>
                      <span className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {serverData.version.name}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center py-4 transition-colors duration-300`}>
                      <span className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Protocol:
                      </span>
                      <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        {serverData.version.protocol}
                      </span>
                    </div>
                  </div>

                  {/* MOTD Section */}
                  {serverData.motd && (
                    <div className={`mt-8 pt-8 border-t transition-colors duration-300 ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Message of the Day
                      </h3>
                      <div className={`rounded-xl p-4 transition-colors duration-300 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`whitespace-pre-line transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {serverData.motd.clean}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Server Icon */}
                  {serverData.favicon && (
                    <div className={`mt-8 pt-8 border-t transition-colors duration-300 ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Server Icon
                      </h3>
                      <img 
                        src={serverData.favicon} 
                        alt="Server Icon" 
                        className="w-16 h-16 rounded-lg shadow-lg"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Player List */}
                <div className={`rounded-2xl p-8 shadow-xl transition-all duration-300 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Online Players
                    <span className={`text-sm font-normal ml-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({serverData.players.online.toLocaleString()} online)
                    </span>
                  </h2>
                  
                  {serverData.players.list && serverData.players.list.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {serverData.players.list.map((player, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            {(player.name || player.name_clean || 'Unknown').charAt(0).toUpperCase()}
                          </div>
                          <span className={`font-semibold text-lg transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {player.name || player.name_clean || 'Unknown'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <p className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No player list available
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Server may have player list disabled
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-20 transition-colors duration-300 ${
        darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-12">
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
