import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './store/uiStore';

// Import pages (we'll create these next)
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import shared components (we'll create these later)
import LoadingSpinner from './components/shared/LoadingSpinner';
import NotificationContainer from './components/shared/NotificationContainer';

/**
 * Main App component with routing and authentication
 */
function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const { theme } = useTheme();

  // Check authentication status on app startup
  useEffect(() => {
    checkAuth();
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <RegisterPage />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/chat" 
            element={
              isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global notification container */}
        <NotificationContainer />
      </div>
    </Router>
  );
}

export default App;