import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS, ColorName } from '@/config/app';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  to?: string;
  href?: string;
  target?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  color?: ColorName; // Use predefined colors from COLORS
  overrideClasses?: string; // Override with custom Tailwind classes
  
  // Click-once loading functionality
  loadingOnClick?: boolean; // Auto-enable loading on click
  loadingDuration?: number; // Duration in ms (default: 2000ms)
  onLoadingComplete?: () => void; // Callback when loading completes
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  to,
  href,
  target,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  color,
  overrideClasses,
  loadingOnClick = false,
  loadingDuration = 2000,
  onLoadingComplete,
  ...props
}) => {
  const [isClickLoading, setIsClickLoading] = React.useState(false);

  const baseStyles = [
    'inline-flex items-center justify-center gap-2',
    'font-medium tracking-wide',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
    fullWidth ? 'w-full' : '',
  ];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8 rounded-full min-w-16',
    md: 'px-6 py-2.5 text-sm h-10 rounded-full min-w-20',
    lg: 'px-8 py-3 text-base h-12 rounded-full min-w-24',
  };

  // Get custom color classes for predefined colors with explicit mappings
  const getColorClasses = () => {
    if (!color) return [];
    
    const colorValue = COLORS[color];
    if (!colorValue) return [];

    // Explicit color mappings to ensure Tailwind includes these classes
    const colorMappings = {
      'blue-600': {
        filled: ['bg-blue-600', 'text-white', 'hover:bg-blue-700'],
        outlined: ['bg-transparent', 'text-blue-600', 'border', 'border-blue-600', 'hover:bg-blue-600', 'hover:text-white'],
        text: ['bg-transparent', 'text-blue-600', 'hover:bg-blue-50']
      },
      'gray-500': {
        filled: ['bg-gray-500', 'text-white', 'hover:bg-gray-600'],
        outlined: ['bg-transparent', 'text-gray-500', 'border', 'border-gray-500', 'hover:bg-gray-500', 'hover:text-white'],
        text: ['bg-transparent', 'text-gray-500', 'hover:bg-gray-50']
      },
      'green-600': {
        filled: ['bg-green-600', 'text-white', 'hover:bg-green-700'],
        outlined: ['bg-transparent', 'text-green-600', 'border', 'border-green-600', 'hover:bg-green-600', 'hover:text-white'],
        text: ['bg-transparent', 'text-green-600', 'hover:bg-green-50']
      },
      'red-600': {
        filled: ['bg-red-600', 'text-white', 'hover:bg-red-700'],
        outlined: ['bg-transparent', 'text-red-600', 'border', 'border-red-600', 'hover:bg-red-600', 'hover:text-white'],
        text: ['bg-transparent', 'text-red-600', 'hover:bg-red-50']
      },
      'yellow-300': {
        filled: ['bg-yellow-300', 'text-black', 'hover:bg-yellow-400'],
        outlined: ['bg-transparent', 'text-yellow-600', 'border', 'border-yellow-300', 'hover:bg-yellow-300', 'hover:text-black'],
        text: ['bg-transparent', 'text-yellow-600', 'hover:bg-yellow-50']
      },
      'sky-500': {
        filled: ['bg-sky-500', 'text-white', 'hover:bg-sky-600'],
        outlined: ['bg-transparent', 'text-sky-500', 'border', 'border-sky-500', 'hover:bg-sky-500', 'hover:text-white'],
        text: ['bg-transparent', 'text-sky-500', 'hover:bg-sky-50']
      }
    };

    // Get the appropriate variant
    const variantKey = (variant === 'elevated' || variant === 'tonal') ? 'filled' : variant;
    const colorMapping = colorMappings[colorValue as keyof typeof colorMappings];
    
    if (colorMapping && colorMapping[variantKey as keyof typeof colorMapping]) {
      return [
        ...colorMapping[variantKey as keyof typeof colorMapping],
        'focus:ring-blue-500'
      ];
    }

    // Fallback for any unmapped colors
    return [];
  };

  // Get default variant classes when no color is specified
  const getDefaultVariantClasses = () => {
    const variantClasses = {
      filled: [
        'bg-blue-600 text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500',
        'shadow-sm'
      ],
      outlined: [
        'bg-transparent text-blue-600',
        'border border-blue-600',
        'hover:bg-blue-600 hover:text-white',
        'focus:ring-blue-500'
      ],
      text: [
        'bg-transparent text-blue-600',
        'hover:bg-blue-50',
        'focus:ring-blue-500'
      ],
      elevated: [
        'bg-blue-600 text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500',
        'shadow-md hover:shadow-lg'
      ],
      tonal: [
        'bg-blue-100 text-blue-900',
        'hover:bg-blue-200',
        'focus:ring-blue-500'
      ],
    };

    const variantKey = variant === 'elevated' || variant === 'tonal' ? 'filled' : variant;
    return variantClasses[variantKey] || variantClasses.filled;
  };

  // Handle click with optional loading functionality
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || isClickLoading) return;

    // Call the original onClick handler
    if (onClick) {
      onClick(e);
    }

    // Handle click-once loading
    if (loadingOnClick) {
      setIsClickLoading(true);
      
      setTimeout(() => {
        setIsClickLoading(false);
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, loadingDuration);
    }
  };

  // Determine if we're in a loading state
  const isLoading = loading || isClickLoading;

  // Build final button classes
  const colorClasses = color ? getColorClasses() : [];
  const defaultClasses = !color && !overrideClasses ? getDefaultVariantClasses() : [];

  const buttonClasses = [
    ...baseStyles,
    sizeStyles[size],
    ...(overrideClasses ? [overrideClasses] : [...colorClasses, ...defaultClasses]),
    isLoading ? 'cursor-wait' : '',
    className,
  ].filter(Boolean).join(' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
  );

  // Button content with icon and loading state
  const buttonContent = (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span className={isLoading ? 'opacity-75' : ''}>
        {isLoading && loadingOnClick ? 'Loading...' : children}
      </span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </>
  );

  // Common button props
  const buttonProps = {
    className: buttonClasses,
    disabled: disabled || isLoading,
    onClick: handleClick,
    type,
    ...props,
  };

  // Render as external link
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        onClick={(e) => {
          e.preventDefault();
          handleClick(e as any);
          if (!disabled && !isLoading && href) {
            window.open(href, target || '_self');
          }
        }}
      >
        {buttonContent}
      </a>
    );
  }

  // Render as router link
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        onClick={(e) => {
          if (disabled || isLoading) {
            e.preventDefault();
            return;
          }
          handleClick(e as any);
        }}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as button
  return (
    <button {...buttonProps}>
      {buttonContent}
    </button>
  );
};

export default Button;