/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0d1a0f',
        surface: '#132016',
        accent: '#4ade80',
        text: '#e8f5e9'
      }
    },
  },
  plugins: [],
}
