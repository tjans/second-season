// =============================================================================
// APP CONFIGURATION
// =============================================================================
// Central configuration file for the React JWT Template/Accelerator
// Simple and easy to customize!
//
// USAGE EXAMPLES:
// 
// 1. Button with predefined color:
//    <Button variant="filled" color="primary">Click me</Button>
//
// 2. Button with custom Tailwind classes (includes hover):
//    <Button variant="filled" overrideClasses="bg-purple-500 hover:bg-purple-600 text-white">
//      Custom Purple
//    </Button>
//
// 3. Button with custom hex color (using arbitrary values):
//    <Button variant="filled" overrideClasses="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white">
//      Custom Hex
//    </Button>
//
// 4. Link with predefined color:
//    <Link to="/" color="primary">Home</Link>
//
// 5. Link with custom classes:
//    <Link to="/" overrideClasses="text-purple-600 hover:text-purple-500">
//      Custom Link
//    </Link>
//
// 6. Get header styles for Layout:
//    const headerStyles = getHeaderStyles();
//
// 7. Customize your brand:
//    Change theme colors in @/config/theme.ts

// Application Information
export const APP_NAME = "Second Season Manager";
export const APP_DESCRIPTION = "Second Season Manager - A Football Simulation Management App";
export const APP_VERSION = "1.0.0";

// =============================================================================
// THEME IMPORTS
// =============================================================================
// Import theme configuration from dedicated theme file
import {
  COLORS,
  HOVER_COLORS,
  HEADER_CONFIG,
  LINK_CONFIG,
  type ColorName,
  getHoverColor,
  isValidColorName,
  getColorValue,
} from "./theme";

// Re-export for backward compatibility
export {
  COLORS,
  HOVER_COLORS,
  HEADER_CONFIG,
  LINK_CONFIG,
  type ColorName,
  getHoverColor,
  isValidColorName,
  getColorValue,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get inline styles for header
 */
export const getHeaderStyles = () => ({
  backgroundColor: HEADER_CONFIG.backgroundColor,
  color: HEADER_CONFIG.textColor,
});