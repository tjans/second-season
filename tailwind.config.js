/** @type {import('tailwindcss').Config} */
//const withMT = require("@material-tailwind/react/utils/withMT");
// https://www.tutorialrepublic.com/html-reference/html-color-picker.php

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out forwards',
      }
    },

  },
  plugins: [],
}

