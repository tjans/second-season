import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { COLORS, ColorName } from '@/config/app';

export interface ButtonLinkProps {
    children: React.ReactNode;
    to?: string; // For internal routing
    href?: string; // For external links
    variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    target?: string;
    className?: string;
    fullWidth?: boolean;
    color?: ColorName; // Use predefined colors from COLORS
    overrideClasses?: string; // Override with custom Tailwind classes
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
    children,
    to,
    href,
    variant = 'filled',
    size = 'md',
    disabled = false,
    icon,
    iconPosition = 'left',
    target,
    className = '',
    fullWidth = false,
    color,
    overrideClasses,
    ...props
}) => {
    const baseStyles = [
        'inline-flex items-center justify-center gap-2',
        'font-medium tracking-wide',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'no-underline', // Remove default link underline
        disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'cursor-pointer',
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
                'bg-blue-100 text-blue-700',
                'hover:bg-blue-200',
                'focus:ring-blue-500'
            ]
        };

        return variantClasses[variant] || variantClasses.filled;
    };

    // Build classes
    const classes = [
        ...baseStyles,
        sizeStyles[size],
        overrideClasses || (color ? getColorClasses() : getDefaultVariantClasses()),
        className
    ].flat().filter(Boolean).join(' ');

    // Render content with optional icon
    const renderContent = () => (
        <>
            {icon && iconPosition === 'left' && (
                <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
                <span className="flex-shrink-0">{icon}</span>
            )}
        </>
    );

    // Render external link
    if (href) {
        return (
            <a
                href={href}
                target={target}
                className={classes}
                {...props}
            >
                {renderContent()}
            </a>
        );
    }

    // Render internal router link
    if (to) {
        return (
            <RouterLink
                to={to}
                className={classes}
                {...props}
            >
                {renderContent()}
            </RouterLink>
        );
    }

    // Fallback - render as span (shouldn't happen in normal usage)
    return (
        <span className={classes} {...props}>
            {renderContent()}
        </span>
    );
};

export default ButtonLink;