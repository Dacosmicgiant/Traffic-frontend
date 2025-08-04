import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface RegisterFormData extends Record<string, string> {
  email: string;
  full_name: string;
  password: string;
  confirmPassword: string;
}

/**
 * Register form component
 */
function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  
  const {
    values,
    handleChange,
    handleBlur,
    validateForm,
    getFieldError
  } = useForm<RegisterFormData>({
    initialValues: {
      email: '',
      full_name: '',
      password: '',
      confirmPassword: ''
    },
    validationRules: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      full_name: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      password: {
        required: true,
        minLength: 6,
        maxLength: 100
      },
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (value !== values.password) {
            return 'Passwords do not match';
          }
          return null;
        }
      }
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await register({
      email: values.email,
      full_name: values.full_name,
      password: values.password
    });
    
    if (success) {
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join Traffic AI and start getting answers
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            
            {/* Global error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Full name field */}
            <Input
              name="full_name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={values.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('full_name')}
              required
            />

            {/* Email field */}
            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('email')}
              required
            />

            {/* Password field */}
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Create a password (min 6 characters)"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('password')}
              helperText="Minimum 6 characters required"
              required
            />

            {/* Confirm password field */}
            <Input
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('confirmPassword')}
              required
            />

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Links */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in here
            </Link>
          </p>
          
          <Link 
            to="/" 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;