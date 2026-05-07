/** @type {import('tailwindcss').Config} */
export default {
  content: ['./demo/index.html', './demo/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bd: {
          green: '#006a4e',
          'green-dark': '#00543e',
          'green-soft': '#1c8a6e',
          red: '#f42a41',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
