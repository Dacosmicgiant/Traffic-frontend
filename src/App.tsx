import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Import pages
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import shared components
import AppInitializer from './components/shared/AppInitializer';
import NotificationContainer from './components/shared/NotificationContainer';
import BackendStatus from './components/shared/BackendStatus';

/**
 * Main App component with routing and authentication
 */
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AppInitializer>
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
          
          {/* Backend status indicator (for development) */}
          {import.meta.env.DEV && <BackendStatus />}
        </div>
      </Router>
    </AppInitializer>
  );
}

export default App;