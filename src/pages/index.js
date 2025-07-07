import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const [serverIp, setServerIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!serverIp.trim()) {
      return;
    }

    setIsLoading(true);
    router.push(`/server/${encodeURIComponent(serverIp.trim())}`);
  };

  return (
    <>
      <Head>
        <title>McStatus.eu - Minecraft Server Status</title>
        <meta name="description" content="Check if your Minecraft server is online and get detailed information" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">McStatus.eu</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">API</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Help</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Minecraft Server Status Checker
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Check if your Minecraft server is online and get detailed information about players, version, and more.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg border p-8 mb-16">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-2">
                  Server IP Address
                </label>
                <input 
                  type="text" 
                  id="ip" 
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                  placeholder="e.g. play.hypixel.net or 192.168.1.100:25565"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  required
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors text-lg"
                >
                  {isLoading ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </form>
          </div>

          {/* Features */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-12">Why McStatus.eu?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Fast</h4>
                <p className="text-gray-600">Get server status in milliseconds</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Free</h4>
                <p className="text-gray-600">No registration required, completely free</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Reliable</h4>
                <p className="text-gray-600">99.9% uptime, available 24/7</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-20">
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
