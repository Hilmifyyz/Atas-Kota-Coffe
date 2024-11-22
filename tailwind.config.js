/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'Logo': "url('/src/assets/Logo.png')",
        'LogoMini': "url('/src/assets/Logo Mini.png')",
      }, 
      colors: {
        'brownpage': '#FFFBF2',
        'brownbutton': '#CBBDA6',
        'brownbuttonhover': '#B0A392',
      },
    },
  },
  plugins: [],
}