import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LINK_CONFIG, COLORS, ColorName, HOVER_COLORS } from '@/config/app';

export interface LinkProps extends Omit<RouterLinkProps, 'color' | 'to'> {
  children: React.ReactNode;
  to?: string; // Make optional for external links
  color?: ColorName; // Use predefined colors from COLORS
  underline?: boolean; // Override default underline setting
  external?: boolean; // If true, renders as <a> tag instead of RouterLink
  href?: string; // For external links
  target?: string; // For external links
  className?: string;
  overrideClasses?: string; // Override with custom Tailwind classes
}

const Link: React.FC<LinkProps> = ({
  children,
  color,
  underline = LINK_CONFIG.underline,
  external = false,
  href,
  target,
  className = '',
  overrideClasses,
  to,
  ...props
}) => {
  // Get color classes for predefined colors
  // Helper function to get hover color
  const getHoverColor = (baseColor: string): string => {
    // Check if we have a predefined hover mapping (including named colors)
    if (baseColor in HOVER_COLORS) {
      return HOVER_COLORS[baseColor as keyof typeof HOVER_COLORS];
    }
    
    // Fallback to automatic calculation
    const colorMatch = baseColor.match(/([a-z]+)-(\d+)/);
    if (colorMatch) {
      const [, colorName, colorNumber] = colorMatch;
      const num = parseInt(colorNumber);
      return num <= 600 ? `${colorName}-${num + 100}` : `${colorName}-${Math.max(num - 100, 500)}`;
    }
    
    return baseColor;
  };

  const getColorClasses = () => {
    if (!color) return ['text-blue-600', 'decoration-blue-600', 'hover:text-blue-700', 'hover:decoration-blue-700'];
    
    const colorValue = COLORS[color];
    if (!colorValue) return ['text-blue-600', 'decoration-blue-600', 'hover:text-blue-700', 'hover:decoration-blue-700'];

    // Use the hover color system for consistent colors
    const baseTextColor = `text-${colorValue}`;
    const baseDecorationColor = `decoration-${colorValue}`;
    const hoverTextColor = `hover:text-${getHoverColor(colorValue)}`;
    const hoverDecorationColor = `hover:decoration-${getHoverColor(colorValue)}`;

    return [baseTextColor, baseDecorationColor, hoverTextColor, hoverDecorationColor];
  };

  // Build complete class list
  const linkClasses = [
    'transition-colors duration-200',
    'cursor-pointer',
    underline ? 'underline hover:no-underline' : 'no-underline hover:underline',
    ...getColorClasses(),
    overrideClasses,
    className,
  ].filter(Boolean).join(' ');

  // For external links, use regular <a> tag
  if (external && href) {
    return (
      <a
        href={href}
        target={target}
        className={linkClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  // For internal links, use React Router Link
  return (
    <RouterLink
      to={to || '/'}
      className={linkClasses}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
