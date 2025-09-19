import React, { useState, useRef } from 'react';
import { ColorName } from '@/config/app';

export interface TextInputProps {
  // Form integration
  rules?: any;
  error?: any;
  name: string;
  register?: any;
  
  // Basic props
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  
  // Material 3 styling options
  variant?: 'filled' | 'outlined' | 'standard';
  color?: ColorName;
  size?: 'sm' | 'md' | 'lg';
  
  // Input types and functionality
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  
  // Icons and actions
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  clearable?: boolean;
  
  // Layout
  fullWidth?: boolean;
  className?: string;
  overrideClasses?: string;
  
  // Events
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClear?: () => void;
  
  // Additional HTML props
  [key: string]: any;
}

export const TextInput: React.FC<TextInputProps> = ({
  // Form props
  rules,
  error,
  name,
  register,
  
  // Basic props
  label,
  placeholder,
  helperText,
  required = false,
  disabled = false,
  value,
  defaultValue,
  
  // Material 3 props
  variant = 'filled',
  color = 'primary',
  size = 'md',
  
  // Input props
  type = 'text',
  multiline = false,
  rows = 3,
  maxLength,
  
  // Icon props
  startIcon,
  endIcon,
  clearable = false,
  
  // Layout props
  fullWidth = false,
  className = '',
  overrideClasses,
  
  // Event props
  onChange,
  onFocus,
  onBlur,
  onClear,
  
  // Rest props
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Determine if label should float - force float when defaultValue exists
  const currentValue = value !== undefined ? value : internalValue;
  const hasCurrentValue = currentValue.length > 0;
  const hasDefaultValue = Boolean(defaultValue && defaultValue.toString().trim().length > 0);
  
  // Always float label if there's a defaultValue or current value or focused
  const shouldFloat = focused || hasCurrentValue || hasDefaultValue;
  
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
          input: 'px-3 py-2 text-sm leading-tight',
          label: 'text-xs px-3',
        };
      case 'lg':
        return {
          container: 'text-lg',
          input: 'px-4 py-4 text-lg leading-tight',
          label: 'text-sm px-4',
        };
      default: // md
        return {
          container: 'text-base',
          input: 'px-3 py-3 text-base leading-tight',
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
          input: `w-full bg-transparent border-none outline-none ${sizes.input} ${disabled ? 'cursor-not-allowed' : ''}`,
          label: `absolute left-0 transition-all duration-200 pointer-events-none ${sizes.label} ${
            shouldFloat 
              ? `-top-2 bg-white px-1 transform scale-90 ${colors.label}` 
              : `top-3 text-gray-500`
          }`,
        };
      
      case 'standard':
        return {
          container: `relative border-b-2 ${colors.border} ${disabled ? 'bg-gray-50' : ''}`,
          input: `w-full bg-transparent border-none outline-none ${sizes.input} ${disabled ? 'cursor-not-allowed' : ''}`,
          label: `absolute left-0 transition-all duration-200 pointer-events-none ${sizes.label} ${
            shouldFloat 
              ? `-top-6 transform scale-90 ${colors.label}` 
              : `top-3 text-gray-500`
          }`,
        };
      
      default: // filled
        return {
          container: `relative rounded-t-md border-b-2 bg-gray-200 hover:bg-gray-300 transition-colors ${colors.border} ${disabled ? 'bg-gray-300' : ''} ${focused ? 'bg-gray-300' : ''}`,
          input: `w-full bg-transparent border-none outline-none ${sizes.input} ${shouldFloat ? 'pt-6 pb-2' : ''} ${disabled ? 'cursor-not-allowed' : ''}`,
          label: `absolute left-0 transition-all duration-200 pointer-events-none ${sizes.label} ${
            shouldFloat 
              ? `top-1 transform scale-75 origin-left ${colors.label}` 
              : `top-3 text-gray-500`
          }`,
        };
    }
  };
  
  const variantClasses = getVariantClasses();
  const colorClasses = getColorClasses();
  
  const showClearButton = clearable && (value !== undefined ? value : internalValue).length > 0 && !disabled;
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  // Get register properties if using React Hook Form
  const registerProps = register ? register(name, rules) : {};
  
  // Merge onChange handlers
  const mergedOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e);
    registerProps.onChange?.(e);
  };
  
  const handleClear = () => {
    if (value === undefined) {
      setInternalValue('');
    }
    onClear?.();
    inputRef.current?.focus();
  };
  
  // Use override classes if provided
  if (overrideClasses) {
    return (
      <div className={`my-5 ${fullWidth ? 'w-full' : ''} ${className}`}>
        <div className={overrideClasses}>
          <label className="block mb-2 font-medium">
            {label}
            {required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </label>
          
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              {...registerProps}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              onChange={mergedOnChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              {...registerProps}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              onChange={mergedOnChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
          )}
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
          <div className="absolute left-3 top-3 text-gray-400">
            {startIcon}
          </div>
        )}
        
        {/* Input Field */}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            {...registerProps}
            className={`${variantClasses.input} ${startIcon ? 'pl-12' : ''} ${showClearButton || endIcon ? 'pr-12' : ''} resize-none`}
            value={value}
            defaultValue={defaultValue}
            placeholder={focused ? placeholder : ''}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            onChange={mergedOnChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            {...registerProps}
            className={`${variantClasses.input} ${startIcon ? 'pl-12' : ''} ${showClearButton || endIcon ? 'pr-12' : ''}`}
            value={value}
            defaultValue={defaultValue}
            placeholder={focused ? placeholder : ''}
            disabled={disabled}
            maxLength={maxLength}
            onChange={mergedOnChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        )}
        
        {/* Floating Label */}
        <label className={`${variantClasses.label} ${startIcon ? 'pl-9' : ''}`}>
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        
        {/* End Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 -translate-y-0.5 flex items-center space-x-2 h-5">
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {endIcon && (
            <div className="text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
      </div>
      
      {/* Helper Text */}
      {helperText && (
        <small className={`block mt-1`}>
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