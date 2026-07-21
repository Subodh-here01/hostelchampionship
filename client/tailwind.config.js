/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0C0C0F',
        card: '#141418',
        muted: '#1C1C22',
        accent: {
          DEFAULT: '#E8C547', // gold
          red: '#E84747',   // live/danger
          green: '#47E87A'  // win/success
        },
        'text-bright': '#F5F5F5',
        'text-muted': '#6B7280',
        border: '#2A2A32'
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        score: ['Orbitron', 'sans-serif']
      }
    },
  },
  plugins: [],
}
