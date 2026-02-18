/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ctlBlack: '#131110',
        ctlWhite: '#FFFEF8',
        ctlGreen: '#DCE34C',
        ctlBlue: '#6DC9C9',
        ctlMoon: '#D6D5D3',
        ctlCharcoal: '#2A2A2A',
        ctlMid: '#6B6B6B',
        ctlLight: '#E8E7E5',
        ctlSurface: '#F5F4F2',
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
