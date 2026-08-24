import { useState, forwardRef } from 'react';
import FormField from './form-field';

/* password input component with show/hide toggle functionality @param {object} props - component props @param {string} props.label - field label text @param {string} props.id - field id @param {string} props.name - input name attribute @param {string} [props.placeholder='enter password'] - input placeholder text @param {string} [props.value=''] - input value @param {function} props.onchange - change handler function @param {string} [props.error=''] - error message to display @param {boolean} [props.required=false] - whether field is required @param {boolean} [props.disabled=false] - whether field is disabled @param {string} [props.classname=''] - additional css classes @param {boolean} [props.showtoggle=true] - whether to show the visibility toggle */
const PasswordInput = forwardRef(({
  label = 'Password',
  placeholder = 'Enter password',
  showToggle = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // eye icon for show password
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 10.8334C5.5 4.16671 14.5 4.16671 17.5 10.8334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.1666C8.61929 14.1666 7.5 13.0473 7.5 11.6666C7.5 10.2859 8.61929 9.16663 10 9.16663C11.3807 9.16663 12.5 10.2859 12.5 11.6666C12.5 13.0473 11.3807 14.1666 10 14.1666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // eye-off icon for hide password
  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 10.8334C5.5 4.16671 14.5 4.16671 17.5 10.8334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.1666C8.61929 14.1666 7.5 13.0473 7.5 11.6666C7.5 10.2859 8.61929 9.16663 10 9.16663C11.3807 9.16663 12.5 10.2859 12.5 11.6666C12.5 13.0473 11.3807 14.1666 10 14.1666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 2L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const toggleButton = showToggle ? (
    <button
      type="button"
      className="text-gray-500 hover:text-yellowGreen-600 focus:outline-none focus:text-yellowGreen-600 transition-colors duration-200"
      onClick={togglePasswordVisibility}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  ) : null;

  return (
    <FormField
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      label={label}
      placeholder={placeholder}
      rightElement={toggleButton}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;