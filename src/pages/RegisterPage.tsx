import { Link } from 'react-router-dom';

/**
 * Register page component - placeholder for now
 * We'll build the full form in the next step
 */
function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join us and start getting answers about Indian traffic laws
          </p>
        </div>
        
        {/* We'll replace this with actual form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Registration form will be implemented here
          </p>
          <div className="mt-4 text-center">
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-500"
            >
              Already have an account? Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;