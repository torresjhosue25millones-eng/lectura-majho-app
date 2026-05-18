/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFAF4',
        sand: '#F0E8D8',
        stone: '#3D3025',
        muted: '#7A6A5A',
        sage: '#5C8A6E',
        dorado: '#C9A84C',
        lavanda: '#EDE8F5',
        beige: '#F5EFE0',
        verde: '#5C8A6E',
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
