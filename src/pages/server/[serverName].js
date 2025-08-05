import { useState, useEffect } from 'react';

export default function ServerStatus() {
  const [serverName, setServerName] = useState('play.extremecraft.net');
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchIp, setSearchIp] = useState('play.extremecraft.net');
  const [darkMode, setDarkMode] = useState(false);

  const fetchServerData = async (serverAddress) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.mcstatus.eu/java/${encodeURIComponent(serverAddress)}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const transformedData = {
        online: data.online,
        timestamp: new Date().toISOString(),
        players: {
          online: data.players?.online || 0,
          max: data.players?.max || 0,
          list: data.players?.list || null,
        },
        version: {
          name: data.version?.name_clean || data.version?.name_raw || 'Unknown',
          protocol: data.version?.protocol || 0,
        },
        motd: {
          clean: data.motd?.clean || 'No MOTD available',
        },
        favicon: data.icon || null,
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
      <header className={`border-b ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              McStatus.eu
            </a>
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-6 md:space-x-8">
                <a href="/" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Home</a>
                <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>API</a>
                <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Help</a>
              </nav>
              <button onClick={toggleDarkMode} className={`p-2 rounded-xl transition-all ${
                darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0..." clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707..." />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className={`rounded-2xl p-6 shadow-xl mb-8 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="ip" className={`block text-sm font-medium mb-3 ${
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
                placeholder="e.g. play.hypixel.net"
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Server Status: {serverName}
          </h1>
          {serverData && !loading && (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last checked: {new Date(serverData.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        {loading && (
          <div className={`rounded-2xl p-8 text-center shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading server status...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {serverData && !loading && !error && (
          <div className={`rounded-2xl p-6 shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              {serverData.favicon && (
                <img src={serverData.favicon} alt="Server Icon" className="h-10 w-10 mr-4" />
              )}
              <div>
                <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {serverName}
                </h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {serverData.motd.clean}
                </p>
              </div>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Status:</strong> {serverData.online ? 'Online ✅' : 'Offline ❌'}
            </p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Players:</strong> {serverData.players.online} / {serverData.players.max}
            </p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Version:</strong> {serverData.version.name}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
