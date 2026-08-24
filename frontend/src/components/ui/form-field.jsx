import { forwardRef } from 'react';

/* reusable form field component with label, input, and error handling @param {object} props - component props @param {string} props.label - field label text @param {string} props.id - field id (also used for htmlfor) @param {string} props.name - input name attribute @param {'text'|'email'|'password'|'tel'|'url'|'number'} [props.type='text'] - input type @param {string} [props.placeholder=''] - input placeholder text @param {string|number} [props.value=''] - input value @param {function} props.onchange - change handler function @param {string} [props.error=''] - error message to display @param {boolean} [props.required=false] - whether field is required @param {boolean} [props.disabled=false] - whether field is disabled @param {string} [props.classname=''] - additional css classes for container @param {string} [props.inputclassname=''] - additional css classes for input @param {react.reactnode} [props.rightelement] - element to display on right side of input @param {string} [props.description=''] - helper text to display below input */
const FormField = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  rightElement,
  description = '',
  ...props
}, ref) => {
  // base input classes
  const baseInputClasses = 'py-2 px-4 h-11 w-full text-gray-500 placeholder-gray-500 bg-brand-light bg-opacity-40 border rounded-lg shadow-sm outline-none ring ring-transparent transition-colors duration-200';

  // error state classes
  const errorClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-200 focus:border-yellowGreen-500 focus:ring-yellowGreen-500';

  // disabled state classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // right element padding
  const rightElementPadding = rightElement ? 'pr-12' : '';

  // combine input classes
  const inputClasses = `${baseInputClasses} ${errorClasses} ${disabledClasses} ${rightElementPadding} ${inputClassName}`.trim();

  // generate unique ids if not provided
  const fieldId = id || `field-${name}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className={`mb-4 ${className}`}>
      {/* label */}
      <label
        className="block mb-2 text-sm font-medium text-gray-700"
        htmlFor={fieldId}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* input container for relative positioning */}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={fieldId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${error ? errorId : ''} ${description ? descriptionId : ''}`.trim() || undefined}
          {...props}
        />

        {/* right element (like password toggle) */}
        {rightElement && (
          <div className="absolute top-1/2 right-0 mr-3 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {/* error message */}
      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* description/helper text */}
      {description && !error && (
        <p
          id={descriptionId}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;