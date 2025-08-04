import { Link } from 'react-router-dom';

/**
 * Login page component - placeholder for now
 * We'll build the full form in the next step
 */
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Login to Your Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        
        {/* We'll replace this with actual form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Login form will be implemented here
          </p>
          <div className="mt-4 text-center">
            <Link 
              to="/register"
              className="text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;