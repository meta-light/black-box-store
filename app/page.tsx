'use client';
import { useEffect, useState } from 'react';
import { DepinApp } from '@/app/types';

interface AppCardProps {app: DepinApp; onUpdate: () => void;}

function AppCard({ app, onUpdate }: AppCardProps) {
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState('');
  const handleInstall = async () => {
    if (!confirm(`Install ${app.name}?`)) return;
    setLoading(true);
    try {
      const healthCheck = await fetch('/api/docker/health');
      const healthData = await healthCheck.json();
      if (!healthData.success) {alert('Docker is not running. Please start Docker Desktop and try again.'); setLoading(false); return;}
      const response = await fetch(`/api/apps/${app.id}/install`, {method: 'POST'});
      const data = await response.json();
      if (data.success) {alert('App installed successfully!'); onUpdate();} 
      else {alert(`Failed to install: ${data.error}`);}
    } 
    catch (error) {alert('Failed to install app');} 
    finally {setLoading(false);}
  };

  const handleUninstall = async () => {
    if (!confirm(`Uninstall ${app.name}? This will remove all containers and data.`)) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/apps/${app.id}/uninstall`, {method: 'POST'});
      const data = await response.json();
      if (data.success) {alert('App uninstalled successfully!'); onUpdate();} 
      else {alert(`Failed to uninstall: ${data.error}`);}
    } 
    catch (error) {alert('Failed to uninstall app');} 
    finally {setLoading(false);}
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/apps/${app.id}/start`, {method: 'POST'});
      const data = await response.json();
      if (data.success) {alert('App started successfully!'); onUpdate();} 
      else {alert(`Failed to start: ${data.error}`);}
    } 
    catch (error) {alert('Failed to start app');} 
    finally {setLoading(false);}
  };

  const handleStop = async () => {
    if (!confirm(`Stop ${app.name}?`)) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/apps/${app.id}/stop`, {method: 'POST'});
      const data = await response.json();
      if (data.success) {alert('App stopped successfully!'); onUpdate();} 
      else {alert(`Failed to stop: ${data.error}`);}
    } 
    catch (error) {alert('Failed to stop app');} 
    finally {setLoading(false);}
  };

  const handleViewLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/apps/${app.id}/logs`);
      const data = await response.json();
      if (data.success) {setLogs(data.data.logs); setShowLogs(true);} 
      else {alert(`Failed to get logs: ${data.error}`);}
    } 
    catch (error) {alert('Failed to get logs');} 
    finally {setLoading(false);}
  };

  const getStatusColor = () => {
    switch (app.status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (app.status) {
      case 'running': return 'Running';
      case 'stopped': return 'Stopped';
      case 'error': return 'Error';
      default: return 'Available';
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-full" />
            <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
            <p className="text-sm text-gray-400">{app.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <span className="text-sm text-gray-300">{getStatusText()}</span>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{app.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">v{app.version}</span>
          <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">{app.category}</span>
          <span className={`px-2 py-1 text-xs rounded ${
            app.networkStatus === 'mainnet' ? 'bg-green-900/30 text-green-400' :
            app.networkStatus === 'testnet' ? 'bg-yellow-900/30 text-yellow-400' :
            'bg-purple-900/30 text-purple-400'
          }`}>
            {app.networkStatus}
          </span>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">{app.requirements.minMemoryGb}GB RAM</span>
        </div>
        <div className="flex flex-col gap-2">
          {app.status === 'available' && (
            <button
              onClick={handleInstall}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Installing...' : 'Install'}
            </button>
          )}
          {app.status === 'running' && (
            <>
              <button
                onClick={handleStop}
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Stopping...' : 'Stop'}
              </button>
              <button
                onClick={handleViewLogs}
                disabled={loading}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
              >
                View Logs
              </button>
            </>
          )}
          {app.status === 'stopped' && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start'}
            </button>
          )}
          {(app.status === 'running' || app.status === 'stopped') && (
            <button
              onClick={handleUninstall}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Uninstalling...' : 'Uninstall'}
            </button>
          )}
          {app.docs && (
            <a
              href={app.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded font-medium transition-colors text-center block"
            >
              Documentation →
            </a>
          )}
        </div>
      </div>
      {showLogs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Logs - {app.name}</h2>
              <button onClick={() => setShowLogs(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{logs || 'No logs available'}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [apps, setApps] = useState<DepinApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'installed'>('all');
  const fetchApps = async () => {
    try {
      const response = await fetch('/api/apps');
      const data = await response.json();
      if (data.success) {setApps(data.data);}
    } 
    catch (error) {console.error('Failed to fetch apps:', error);} 
    finally {setLoading(false);}
  };
  useEffect(() => {fetchApps();}, []);
  const filteredApps = apps.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'available') return app.status === 'available';
    if (filter === 'installed') return app.status === 'running' || app.status === 'stopped';
    return true;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <img src="/icons/dawn.jpg" alt="Black Box" className="w-12 h-12 rounded-full" />
              <div>
                <h1 className="text-3xl font-bold text-white">Black Box App Store</h1>
                <p className="text-gray-400 mt-1">Manage your decentralized infrastructure nodes</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/meta-light/black-box-store/tree/main/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>View Docs</span>
            </a>
            <a
              href="https://github.com/meta-light/black-box-store/blob/main/docs/ADDING_APPS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Project</span>
            </a>
            <a
              href="https://shop.dawninternet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>Get Dawn Black Box</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Apps ({apps.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'available'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Available ({apps.filter(a => a.status === 'available').length})
            </button>
            <button
              onClick={() => setFilter('installed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'installed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Installed ({apps.filter(a => a.status === 'running' || a.status === 'stopped').length})
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              {filter === 'all' ? 'No apps available yet' : `No ${filter} apps`}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} onUpdate={fetchApps} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}