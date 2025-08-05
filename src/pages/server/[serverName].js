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
      const response = await fetch(`https://api.mcstatus.eu/java/${encodeURIComponent(serverAddress)}`);
      
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
            darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
          }`}>
            <p className="text-lg">Checking server status...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`rounded-2xl p-8 text-center shadow-xl transition-all duration-300 ${
            darkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-lg">{error}</p>
          </div>
        )}

        {/* Server Data */}
        {serverData && !loading && !error && (
          <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 transition-all duration-300`}>
            <div className="rounded-2xl p-6 shadow-xl bg-white border border-gray-200">
              <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Server Info
              </h3>
              <ul className="space-y-4">
                <li>
                  <span className="font-medium">MOTD:</span> {serverData.motd.clean}
                </li>
                <li>
                  <span className="font-medium">Version:</span> {serverData.version.name}
                </li>
                <li>
                  <span className="font-medium">Protocol:</span> {serverData.version.protocol}
                </li>
                <li>
                  <span className="font-medium">Online:</span> {serverData.players.online} / {serverData.players.max}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-6 shadow-xl bg-white border border-gray-200">
              <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Player List
              </h3>
              <ul className="space-y-2">
                {serverData.players.list ? (
                  serverData.players.list.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))
                ) : (
                  <li>No players online</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t transition-colors duration-300 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; 2025 McStatus.eu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
