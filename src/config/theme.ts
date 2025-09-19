// =============================================================================
// THEME CONFIGURATION
// =============================================================================
// Centralized theme configuration for colors, spacing, and design tokens
// Change these values to match your brand and design system

// =============================================================================
// COLOR SYSTEM
// =============================================================================

// Primary color palette - Change these to match your brand!
export const COLORS = {
  primary: "blue-600",     // Main brand color
  secondary: "gray-500",   // Secondary/neutral color  
  success: "green-600",    // Success states and positive actions
  error: "red-600",        // Error states and destructive actions
  warning: "yellow-300",   // Warning states and caution
  info: "sky-500",         // Informational content and neutral actions
} as const;

// Color name type for TypeScript support
export type ColorName = keyof typeof COLORS;

// Hover color mappings for each base color
// Using named color references for better readability and maintainability
export const HOVER_COLORS = {
  // Named colors (references COLORS object - much more readable!)
  [COLORS.primary]: "blue-700",      // blue-600 → blue-700
  [COLORS.secondary]: "gray-600",    // gray-500 → gray-600
  [COLORS.success]: "green-700",     // green-600 → green-700
  [COLORS.error]: "red-700",         // red-600 → red-700
  [COLORS.warning]: "yellow-400",    // yellow-300 → yellow-400
  [COLORS.info]: "sky-600",          // sky-500 → sky-600
  
  // Additional common colors for overrideClasses usage
  "purple-500": "purple-600",
  "orange-500": "orange-600",
  "pink-500": "pink-600",
  "indigo-500": "indigo-600",
  "teal-500": "teal-600",
  "emerald-500": "emerald-600",
  "cyan-500": "cyan-600",
  "amber-500": "amber-600",
  "lime-500": "lime-600",
  "violet-500": "violet-600",
} as const;

// =============================================================================
// COMPONENT THEME CONFIGURATION
// =============================================================================

// Header Configuration
export const HEADER_CONFIG = {
  backgroundColor: "#212121", // Dark gray
  textColor: "#ffffff", // White
} as const;

// Link Configuration
export const LINK_CONFIG = {
  defaultColor: COLORS.primary,     // Default link color (references Tailwind class)
  hoverColor: "blue-700",          // Hover color (Tailwind class)
  underline: true,                 // Show underline by default
} as const;


// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get hover color for any Tailwind color class
 * @param baseColor - The base color (e.g., "blue-600", "purple-500")
 * @returns The corresponding hover color
 */
export const getHoverColor = (baseColor: string): string => {
  // Check if we have a predefined hover mapping
  if (baseColor in HOVER_COLORS) {
    return HOVER_COLORS[baseColor as keyof typeof HOVER_COLORS];
  }
  
  // Extract color name and number from classes like "blue-600", etc.
  const colorMatch = baseColor.match(/([a-z]+)-(\d+)/);
  if (colorMatch) {
    const [, colorName, colorNumber] = colorMatch;
    const num = parseInt(colorNumber);
    
    // For light colors (100-400), go darker by 100
    // For medium colors (500-600), go darker by 100  
    // For dark colors (700-900), stay same or go lighter
    if (num <= 400) {
      return `${colorName}-${Math.min(num + 100, 600)}`;
    } else if (num <= 600) {
      return `${colorName}-${num + 100}`;
    } else {
      return `${colorName}-${Math.max(num - 100, 500)}`;
    }
  }
  
  // Fallback: return the original color
  return baseColor;
};

/**
 * Check if a color is a valid named color from our palette
 * @param color - The color to check
 * @returns True if it's a valid named color
 */
export const isValidColorName = (color: string): color is ColorName => {
  return Object.keys(COLORS).includes(color);
};

/**
 * Get the Tailwind class value for a named color
 * @param colorName - The named color (e.g., "primary", "success")
 * @returns The Tailwind class (e.g., "blue-600", "green-600")
 */
export const getColorValue = (colorName: ColorName): string => {
  return COLORS[colorName];
};
