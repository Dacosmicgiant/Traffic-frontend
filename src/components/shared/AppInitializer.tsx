import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../store/uiStore';
import LoadingSpinner from './LoadingSpinner';

interface AppInitializerProps {
  children: ReactNode;
}

/**
 * App initializer component
 * Handles authentication check and theme initialization on app startup
 */
function AppInitializer({ children }: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { checkAuth, isLoading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set theme on startup
        document.documentElement.setAttribute('data-theme', theme);
        
        // Check authentication status
        await checkAuth();
        
        // Small delay to prevent flash
        setTimeout(() => {
          setIsInitialized(true);
        }, 300);
        
      } catch (error) {
        console.error('App initialization error:', error);
        setIsInitialized(true); // Continue even if auth check fails
      }
    };

    initializeApp();
  }, []);

  // Show loading screen during initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚗</span>
          </div>
          <LoadingSpinner size="large" text="Initializing Traffic AI..." />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AppInitializer;