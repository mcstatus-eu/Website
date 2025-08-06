import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ServerStatus() {
  const router = useRouter();
  const { serverName: routerServerName } = router.query;
  
  const [serverName, setServerName] = useState('');
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [failedAvatars, setFailedAvatars] = useState(new Set());

  // Update serverName when router is ready
  useEffect(() => {
    if (router.isReady && routerServerName) {
      const decodedServerName = decodeURIComponent(routerServerName);
      setServerName(decodedServerName);
      setSearchIp(decodedServerName);
      // Reset failed avatars when switching servers
      setFailedAvatars(new Set());
    }
  }, [router.isReady, routerServerName]);

  // Fetch server data from McStatus.eu API
  const fetchServerData = async (serverAddress) => {
    setLoading(true);
    setError(null);
    setFailedAvatars(new Set()); // Reset failed avatars on new fetch
    
    try {
      const response = await fetch(`https://api.mcstatus.eu/java/${encodeURIComponent(serverAddress)}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const apiResponse = await response.json();
      
      // Transform the API response to match our component structure
      const transformedData = {
        online: apiResponse.online,
        timestamp: new Date().toISOString(),
        players: {
          online: apiResponse.data?.players?.online || 0,
          max: apiResponse.data?.players?.max || 0,
          list: apiResponse.data?.players?.sample || null
        },
        version: {
          name: apiResponse.data?.version?.name?.clean || apiResponse.data?.version?.name?.raw || 'Unknown',
          protocol: apiResponse.data?.version?.protocol || 0
        },
        motd: {
          clean: apiResponse.data?.motd?.clean || 'No MOTD available'
        },
        favicon: apiResponse.data?.favicon || null
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

  // Load initial server data when serverName is available
  useEffect(() => {
    if (serverName) {
      fetchServerData(serverName);
    }
  }, [serverName]);

  const handleSearch = () => {
    if (searchIp.trim() && searchIp.trim() !== serverName) {
      const trimmedIp = searchIp.trim();
      setServerName(trimmedIp);
      fetchServerData(trimmedIp);
      // Navigate to new server URL with correct path
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

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-pulse ${
          darkMode ? 'bg-blue-500' : 'bg-purple-300'
        }`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className={`relative backdrop-blur-sm border-b transition-all duration-500 ${
        darkMode 
          ? 'border-gray-700/50 bg-gray-900/30' 
          : 'border-white/50 bg-white/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              } shadow-lg`}>
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                McStatus.eu
              </h1>
            </div>
            
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <a href="/" className={`font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:text-purple-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:text-blue-600'
                }`}>
                  Home
                </a>
                <a href="#" className={`font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:text-purple-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:text-blue-600'
                }`}>
                  API
                </a>
                <a href="#" className={`font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:text-purple-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:text-blue-600'
                }`}>
                  Help
                </a>
              </nav>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-yellow-400 shadow-lg shadow-yellow-400/20' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-700 shadow-lg shadow-gray-900/10'
                } backdrop-blur-sm`}
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 flex-grow">
        {/* Search Section */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 mb-12 transition-all duration-500 hover:shadow-2xl ${
          darkMode 
            ? 'bg-gray-800/30 border border-gray-700/50 shadow-xl shadow-gray-900/50' 
            : 'bg-white/40 border border-white/50 shadow-xl shadow-gray-900/10'
        }`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="ip" className={`block text-lg font-semibold mb-4 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                🔍 Check Server Status
              </label>
              <input 
                type="text" 
                id="ip" 
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!router.isReady}
                placeholder={serverName ? `Currently: ${serverName}` : "Loading..."}
                className={`w-full px-6 py-4 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
                  !router.isReady ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  darkMode 
                    ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500/50 focus:border-purple-500' 
                    : 'bg-white/60 border border-white/60 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500'
                } backdrop-blur-sm`}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                disabled={loading || !router.isReady}
                className={`px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 ${
                  loading || !router.isReady ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
                } ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30'
                }`}
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Checking...</span>
                  </span>
                ) : '🚀 Check Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Title Section */}
        {serverName && (
          <div className="mb-12 text-center">
            <h2 className={`text-5xl font-black mb-4 bg-clip-text text-transparent ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400' 
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
            }`}>
              {serverName}
            </h2>
            {serverData && !loading && (
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ⏰ Last checked: {new Date(serverData.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Router Loading State */}
        {!router.isReady && (
          <div className={`backdrop-blur-sm rounded-3xl p-12 text-center transition-all duration-500 ${
            darkMode 
              ? 'bg-gray-800/30 border border-gray-700/50' 
              : 'bg-white/40 border border-white/50'
          }`}>
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              🎮 Loading server information...
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && serverName && (
          <div className={`backdrop-blur-sm rounded-3xl p-12 text-center transition-all duration-500 ${
            darkMode 
              ? 'bg-gray-800/30 border border-gray-700/50' 
              : 'bg-white/40 border border-white/50'
          }`}>
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              🔍 Checking server status...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && serverName && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 rounded-3xl p-8 mb-12">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-4 animate-pulse"></div>
              <span className="text-red-200 font-semibold text-lg">❌ Error: {error}</span>
            </div>
          </div>
        )}

        {/* Server Data */}
        {serverData && !loading && serverName && (
          <>
            {/* Status Alert */}
            {serverData.online ? (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8 mb-12 transform hover:scale-102 transition-all duration-300">
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-4 animate-pulse"></div>
                  <span className="text-green-200 font-bold text-xl">
                    ✅ Server is online and accepting connections
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 rounded-3xl p-8 mb-12">
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                  <span className="text-red-200 font-bold text-xl">
                    ❌ Server is offline or unreachable
                  </span>
                </div>
              </div>
            )}

            {serverData.online && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Server Information Card */}
                <div className={`backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-102 ${
                  darkMode 
                    ? 'bg-gray-800/30 border border-gray-700/50 shadow-xl shadow-gray-900/50' 
                    : 'bg-white/40 border border-white/50 shadow-xl shadow-gray-900/10'
                }`}>
                  <div className="flex items-center mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      <span className="text-white text-xl">⚙️</span>
                    </div>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Server Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Status */}
                    <div className={`flex justify-between items-center py-6 px-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-white/30'
                    }`}>
                      <span className={`font-semibold text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        🟢 Status:
                      </span>
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          ONLINE
                        </div>
                      </span>
                    </div>

                    {/* Players */}
                    <div className={`flex justify-between items-center py-6 px-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-white/30'
                    }`}>
                      <span className={`font-semibold text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        👥 Players:
                      </span>
                      <span className={`font-black text-3xl bg-clip-text text-transparent ${
                        darkMode 
                          ? 'bg-gradient-to-r from-purple-400 to-blue-400' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}>
                        {serverData.players.online.toLocaleString()}/{serverData.players.max.toLocaleString()}
                      </span>
                    </div>

                    {/* Version */}
                    <div className={`flex justify-between items-center py-6 px-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-white/30'
                    }`}>
                      <span className={`font-semibold text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        🎮 Version:
                      </span>
                      <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {serverData.version.name}
                      </span>
                    </div>

                    {/* Protocol */}
                    <div className={`flex justify-between items-center py-6 px-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-white/30'
                    }`}>
                      <span className={`font-semibold text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        🔧 Protocol:
                      </span>
                      <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        {serverData.version.protocol}
                      </span>
                    </div>
                  </div>

                  {/* MOTD Section */}
                  {serverData.motd && (
                    <div className={`mt-8 pt-8 border-t ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                      <h4 className={`text-xl font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        💬 Message of the Day
                      </h4>
                      <div className={`rounded-2xl p-6 ${
                        darkMode ? 'bg-gray-700/40' : 'bg-white/40'
                      } backdrop-blur-sm`}>
                        <p className={`whitespace-pre-line text-lg leading-relaxed ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {serverData.motd.clean}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Server Icon */}
                  {serverData.favicon && (
                    <div className={`mt-8 pt-8 border-t ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                      <h4 className={`text-xl font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        🖼️ Server Icon
                      </h4>
                      <div className="flex justify-center">
                        <img 
                          src={serverData.favicon} 
                          alt="Server Icon" 
                          className="w-20 h-20 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Players List Card */}
                <div className={`backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-102 ${
                  darkMode 
                    ? 'bg-gray-800/30 border border-gray-700/50 shadow-xl shadow-gray-900/50' 
                    : 'bg-white/40 border border-white/50 shadow-xl shadow-gray-900/10'
                }`}>
                  <div className="flex items-center mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gradient-to-r from-green-500 to-teal-600'
                    }`}>
                      <span className="text-white text-xl">👥</span>
                    </div>
                    <div>
                      <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Online Players
                      </h3>
                      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {serverData.players.online.toLocaleString()} players online
                      </p>
                    </div>
                  </div>
                  
                  {serverData.players.list && serverData.players.list.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                      {serverData.players.list.map((player, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-4 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            darkMode 
                              ? 'bg-gray-700/40 hover:bg-gray-600/50 border border-gray-600/30' 
                              : 'bg-white/50 hover:bg-white/70 border border-white/40'
                          } backdrop-blur-sm group`}
                        >
                          <div className="relative">
                            {player.id && !failedAvatars.has(player.id) ? (
                              <img 
                                src={`https://minotar.net/helm/${player.id}/64`}
                                alt={player.name?.clean || player.name?.raw || player.name || 'Unknown'}
                                className="w-14 h-14 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110"
                                onError={() => {
                                  setFailedAvatars(prev => new Set([...prev, player.id]));
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 group-hover:scale-110">
                                {(player.name?.clean || player.name?.raw || player.name || 'Unknown').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {player.name?.clean || player.name?.raw || player.name || 'Unknown'}
                            </span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            Online
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                        darkMode 
                          ? 'bg-gray-700/50 text-gray-500' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                      <h4 className={`text-2xl font-bold mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No Player List Available
                      </h4>
                      <p className={`text-lg ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
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
      <footer className={`relative backdrop-blur-sm border-t transition-all duration-500 ${
        darkMode 
          ? 'border-gray-700/50 bg-gray-900/30' 
          : 'border-white/50 bg-white/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                <span className="text-white font-bold">M</span>
              </div>
              <span className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                McStatus.eu
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className={`text-lg mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                © 2025 McStatus.eu - Made with 💖
              </p>
              <div className="flex space-x-8 justify-center md:justify-end">
                <a href="#" className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-purple-400' 
                    : 'text-gray-400 hover:text-blue-600'
                }`}>
                  Privacy
                </a>
                <a href="#" className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-purple-400' 
                    : 'text-gray-400 hover:text-blue-600'
                }`}>
                  Terms
                </a>
                <a href="#" className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-purple-400' 
                    : 'text-gray-400 hover:text-blue-600'
                }`}>
                  API
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.3)'};
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(147, 51, 234, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(147, 51, 234, 0.7)' : 'rgba(59, 130, 246, 0.7)'};
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
