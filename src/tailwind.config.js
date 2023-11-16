/** @type {import('tailwindcss').Config} */

import konstaConfig from "konsta/config";

// wrap config with konstaConfig config
module.exports = konstaConfig({
  konsta: {
    colors: {
      // primary: '#000000'
    }
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});