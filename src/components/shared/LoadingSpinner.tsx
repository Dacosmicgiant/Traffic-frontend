interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

/**
 * Loading spinner component
 * Simple, reusable loading indicator
 */
function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
  // Size classes for the spinner
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Spinning circle */}
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="h-full w-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full"></div>
      </div>
      
      {/* Optional loading text */}
      {text && (
        <p className={`mt-2 text-gray-600 dark:text-gray-300 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;