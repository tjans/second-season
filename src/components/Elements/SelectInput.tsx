import React, { useState, useRef, useEffect } from 'react';
import { ColorName } from '@/config/app';

export interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'color'> {
  // Core props
  label: string;
  name: string;
  error?: any;
  helperText?: string;
  
  // React Hook Form integration
  register?: any;
  rules?: any;
  
  // Visual customization
  variant?: 'filled' | 'outlined' | 'standard';
  color?: ColorName;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  
  // Icon support
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  
  // State
  required?: boolean;
  disabled?: boolean;
  
  // Style override
  overrideClasses?: string;
  className?: string;
  
  // Options
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>;
  placeholder?: string;
  children?: React.ReactNode;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  error,
  helperText,
  register,
  rules,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  fullWidth = true,
  startIcon,
  endIcon,
  required = false,
  disabled = false,
  overrideClasses,
  className = '',
  options,
  placeholder,
  children,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [hasActualValue, setHasActualValue] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  
  // Monitor actual select value for proper floating
  useEffect(() => {
    if (selectRef.current) {
      const currentSelectValue = selectRef.current.value;
      // Only consider it a real value if it's not empty string
      const hasValue = currentSelectValue !== '' && currentSelectValue !== undefined && currentSelectValue !== null;
      setHasActualValue(hasValue);
      
      // Debug logging to understand what's happening
      console.log('SelectInput monitor:', {
        name,
        currentSelectValue,
        hasValue,
        focused,
        placeholder,
        shouldFloatWillBe: focused || hasValue || !!placeholder
      });
    }
  }, [value, defaultValue, focused, internalValue, name, placeholder]);
  
  // Initial check for pre-selected values
  useEffect(() => {
    // Check if we have options with pre-selected values
    if (defaultValue || (options && options.length > 0)) {
      const initialValue = defaultValue || value;
      if (initialValue && initialValue !== '') {
        setHasActualValue(true);
      }
    }
  }, []);
  
  // Determine if label should float
  const currentValue = value !== undefined ? value : internalValue;
  const hasCurrentValue = currentValue !== '' && currentValue !== undefined && currentValue !== null;
  const hasDefaultValue = Boolean(defaultValue && defaultValue.toString().trim().length > 0);
  
  // For selects, label should float when:
  // - Focused
  // - Has any value (including empty option that shows text)
  // - Has placeholder 
  // - Has options (because select always shows the selected option text)
  const shouldFloat = focused || hasCurrentValue || hasDefaultValue || hasActualValue || !!placeholder || 
    (options && options.length > 0);

  // Color mappings based on theme - explicit classes for Tailwind purging
  const getColorClasses = () => {
    if (error) {
      return {
        border: 'border-red-500 focus:border-red-600',
        label: 'text-red-600',
        helper: 'text-red-600'
      };
    }
    
    // Explicit color mappings to ensure Tailwind includes these classes
    const colorMappings = {
      primary: {
        border: 'border-gray-300 focus:border-blue-600',
        label: 'text-gray-600 focus-within:text-blue-600',
        helper: 'text-gray-500'
      },
      secondary: {
        border: 'border-gray-300 focus:border-gray-500',
        label: 'text-gray-600 focus-within:text-gray-500',
        helper: 'text-gray-500'
      },
      success: {
        border: 'border-gray-300 focus:border-green-600',
        label: 'text-gray-600 focus-within:text-green-600',
        helper: 'text-gray-500'
      },
      error: {
        border: 'border-gray-300 focus:border-red-600',
        label: 'text-gray-600 focus-within:text-red-600',
        helper: 'text-gray-500'
      },
      warning: {
        border: 'border-gray-300 focus:border-yellow-300',
        label: 'text-gray-600 focus-within:text-yellow-300',
        helper: 'text-gray-500'
      },
      info: {
        border: 'border-gray-300 focus:border-sky-500',
        label: 'text-gray-600 focus-within:text-sky-500',
        helper: 'text-gray-500'
      }
    };
    
    return colorMappings[color] || colorMappings.primary;
  };
  
  // Size mappings
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'text-sm',
          select: 'px-3 py-2 text-sm leading-tight',
          label: 'text-xs px-3',
        };
      case 'lg':
        return {
          container: 'text-lg',
          select: 'px-4 py-4 text-lg leading-tight',
          label: 'text-sm px-4',
        };
      default: // md
        return {
          container: 'text-base',
          select: 'px-3 py-3 text-base leading-tight',
          label: 'text-sm px-3',
        };
    }
  };
  
  // Variant styles
  const getVariantClasses = () => {
    const colors = getColorClasses();
    const sizes = getSizeClasses();
    
    switch (variant) {
      case 'outlined':
        return {
          container: `relative border-2 rounded-md ${colors.border} ${disabled ? 'bg-gray-50' : 'bg-white'}`,
          select: `w-full bg-transparent border-none outline-none ${sizes.select} ${disabled ? 'cursor-not-allowed' : ''}`,
          label: `absolute left-0 transition-all duration-200 pointer-events-none z-10 ${sizes.label} ${
            shouldFloat 
              ? `-top-2 bg-white px-1 transform scale-90 ${colors.label}` 
              : `top-4 text-gray-500`
          }`,
        };
      
      case 'standard':
        return {
          container: `relative border-b-2 ${colors.border} ${disabled ? 'bg-gray-50' : ''}`,
          select: `w-full bg-transparent border-none outline-none ${sizes.select} ${disabled ? 'cursor-not-allowed' : ''}`,
          label: `absolute left-0 transition-all duration-200 pointer-events-none z-10 ${sizes.label} ${
            shouldFloat 
              ? `-top-6 transform scale-90 ${colors.label}` 
              : `top-4 text-gray-500`
          }`,
        };
      
      default: // filled
        return {
          container: `relative rounded-t-md border-b-2 bg-gray-200 hover:bg-gray-300 transition-colors ${colors.border} ${disabled ? 'bg-gray-300' : ''} ${focused ? 'bg-gray-300' : ''}`,
          select: `w-full bg-transparent border-none outline-none ${sizes.select} ${shouldFloat ? 'pt-6 pb-2' : ''} ${disabled ? 'cursor-not-allowed' : ''}`,
          label: `absolute left-0 transition-all duration-200 pointer-events-none z-10 ${sizes.label} ${
            shouldFloat 
              ? `top-1 transform scale-75 origin-left ${colors.label}` 
              : `top-4 text-gray-500`
          }`,
        };
    }
  };

  const variantClasses = getVariantClasses();
  const colorClasses = getColorClasses();
  
  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    // Update our actual value state for floating logic
    setHasActualValue(newValue !== '' && newValue !== undefined);
    
    // Call any additional onChange passed as prop
    onChange?.(e);
  };

  // Get register properties if using React Hook Form
  const registerProps = register ? register(name, rules) : {};
  
  // Merge onChange handlers
  const mergedOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    registerProps.onChange?.(e);
  };
  if (overrideClasses) {
    return (
      <div className={`my-5 ${fullWidth ? 'w-full' : ''} ${className}`}>
        <div className={overrideClasses}>
          <label className="block mb-2 font-medium">
            {label}
            {required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </label>
          
          <select
            ref={selectRef}
            {...registerProps}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={mergedOnChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option, index) => (
              <option key={index} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
        </div>
        
        {helperText && (
          <small className={colorClasses.helper}>{helperText}</small>
        )}
        
        {error && (
          <div className="mt-1 text-sm text-red-600">
            {error.message}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`my-5 ${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className={variantClasses.container}>
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 -translate-y-0.5 text-gray-400 flex items-center h-5">
            {startIcon}
          </div>
        )}
        
        {/* Select Field */}
        <select
          ref={selectRef}
          {...registerProps}
          className={`${variantClasses.select} ${startIcon ? 'pl-12' : ''} ${endIcon ? 'pr-12' : ''} appearance-none cursor-pointer`}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={mergedOnChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((option, index) => (
            <option key={index} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        
        {/* Floating Label */}
        <label className={`${variantClasses.label} ${startIcon ? 'pl-9' : ''}`}>
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        
        {/* Dropdown Arrow */}
        <div className={`absolute top-1/2 -translate-y-1/2 -translate-y-0.5 flex items-center h-5 ${endIcon ? 'right-12' : 'right-3'} pointer-events-none`}>
          {endIcon || (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        
        {/* End Icon */}
        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 -translate-y-0.5 text-gray-400 flex items-center h-5">
            {endIcon}
          </div>
        )}
      </div>
      
      {/* Helper Text */}
      {helperText && (
        <small className={`block mt-1 ${colorClasses.helper}`}>
          {helperText}
        </small>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mt-1 text-sm text-red-600">
          {error.message}
        </div>
      )}
    </div>
  );
};