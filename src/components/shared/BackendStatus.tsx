import { useState, useEffect } from 'react';
// import { apiClient } from '../../utils/api';
import { API_CONFIG } from '../../utils/constants';

/**
 * Backend status component for debugging
 * Shows if backend is reachable
 */
function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      // Test basic connection to root endpoint
      const response = await fetch(API_CONFIG.baseURL.replace('/api/v1', ''));
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('error');
        setError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      setStatus('error');
      setError(error.message || 'Cannot connect to backend');
    }
  };

  const statusColors = {
    checking: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    connected: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800'
  };

  const statusIcons = {
    checking: '⏳',
    connected: '✅',
    error: '❌'
  };

  const statusMessages = {
    checking: 'Checking backend connection...',
    connected: 'Backend connected successfully',
    error: `Backend connection failed: ${error}`
  };

  return (
    <div className={`fixed bottom-4 left-4 p-3 rounded-lg border text-sm font-medium ${statusColors[status]} z-50`}>
      <div className="flex items-center space-x-2">
        <span>{statusIcons[status]}</span>
        <span>{statusMessages[status]}</span>
        {status === 'error' && (
          <button
            onClick={checkBackendStatus}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        )}
      </div>
      {status === 'error' && (
        <div className="mt-2 text-xs">
          Make sure your FastAPI backend is running at: {API_CONFIG.baseURL.replace('/api/v1', '')}
        </div>
      )}
    </div>
  );
}

export default BackendStatus;