/* loading spinner component for page transitions and async operations @param {object} props - component props @param {string} [props.size='default'] - spinner size ('small', 'default', 'large') @param {string} [props.classname=''] - additional css classes @param {string} [props.message='loading...'] - loading message @param {boolean} [props.fullscreen=true] - whether to take full screen */
const LoadingSpinner = ({
  size = 'default',
  className = '',
  message = 'Loading...',
  fullScreen = true
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-brand-card bg-opacity-90 z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-live="polite">
      <div className="text-center">
        {/* spinner svg */}
        <svg
          className={`animate-spin mx-auto mb-2 text-cyanGreen-600 ${sizeClasses[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        {/* loading message */}
        <p className="text-sm text-gray-600" id="loading-message">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;