import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ServerStatus() {
  const router = useRouter();
  const { serverName } = router.query;
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchIp, setSearchIp] = useState('');

  useEffect(() => {
    if (serverName) {
      setSearchIp(decodeURIComponent(serverName));
      fetchServerStatus(serverName);
    }
  }, [serverName]);

  const fetchServerStatus = async (server) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/server/${encodeURIComponent(server)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch server status');
      }
      
      setServerData(data);
    } catch (err) {
      setError(err.message);
      setServerData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchIp.trim()) {
      router.push(`/server/${encodeURIComponent(searchIp.trim())}`);
    }
  };

  if (!serverName) return null;

  return (
    <>
      <Head>
        <title>{`${decodeURIComponent(serverName)} - McStatus.eu`}</title>
        <meta name="description" content={`Minecraft server status for ${decodeURIComponent(serverName)}`} />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                McStatus.eu
              </a>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">API</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Help</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-2">
                  Check another server
                </label>
                <input 
                  type="text" 
                  id="ip" 
                  value={searchIp}
                  onChange={(e) => setSearchIp(e.target.value)}
                  placeholder="e.g. play.hypixel.net or 192.168.1.100:25565"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  Check Status
                </button>
              </div>
            </form>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Server Status: {decodeURIComponent(serverName)}
            </h1>
            {serverData && (
              <p className="text-gray-600 mt-2">
                Last checked: {new Date(serverData.timestamp).toLocaleString()}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking server status...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-800 font-medium">
                      Server is online and accepting connections
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-red-800 font-medium">
                      Server is offline or unreachable
                    </span>
                  </div>
                </div>
              )}

              {serverData.online && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Server Details */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Server Information</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Online
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Players:</span>
                        <span className="text-gray-900 font-semibold text-lg">
                          {serverData.players.online}/{serverData.players.max}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Version:</span>
                        <span className="text-gray-900 font-medium">{serverData.version.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Protocol:</span>
                        <span className="text-gray-700">{serverData.version.protocol}</span>
                      </div>
                    </div>

                    {/* MOTD Section */}
                    {serverData.motd && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Message of the Day</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 whitespace-pre-line">{serverData.motd.clean}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Player List */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Online Players
                      <span className="text-sm font-normal text-gray-500">
                        ({serverData.players.online} online)
                      </span>
                    </h2>
                    
                    {serverData.players.list && serverData.players.list.length > 0 ? (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {serverData.players.list.map((player, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-900 font-medium">{player.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <p className="text-gray-500">No player list available</p>
                        <p className="text-gray-400 text-sm mt-1">Server may have player list disabled</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-lg font-semibold text-gray-900">McStatus.eu</span>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 text-sm">© 2025 McStatus.eu. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 justify-center md:justify-end">
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Privacy</a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Terms</a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">API</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
