/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFAF6',
        sand: '#F5EFE6',
        stone: '#3D2B1F',
        muted: '#7A6A5A',
        sage: '#7A9E7E',
        dorado: '#C8A97E',
        'dorado-dark': '#A88960',
        lavanda: '#EDE8F5',
        beige: '#F5EFE6',
        verde: '#7A9E7E',
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
