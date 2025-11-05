/** @type {import('tailwindcss').Config} */
//const withMT = require("@material-tailwind/react/utils/withMT");
// https://www.tutorialrepublic.com/html-reference/html-color-picker.php

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./@/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        midnight: '#343c4d',
        soot: '#212121',
        soft: '#757575',
        lightGray: '#CECECE',

        'btn-primary': '#508DC8',
        'btn-primary-shadow': '#4070a0',
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

