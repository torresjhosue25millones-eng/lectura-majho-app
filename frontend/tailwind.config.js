/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: '#F5EFE0',
        verde: '#5C8A6E',
        dorado: '#C9A84C',
        violeta: '#7B5EA7',
        rosado: '#F2C4CE',
        'dark-purple': '#1a0a2e',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
