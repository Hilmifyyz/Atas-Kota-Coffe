/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'Logo': "url('/src/assets/Photos/Logo.png')",
        'LogoMini': "url('/src/assets/Photos/Logo Mini.png')",
        'Coffee': "url('/src/assets/Photos/Coffee.png')",
        'Alfredo': "url('/src/assets/Photos/Alfredo Pasta.png')",
        'CaffeLatte': "url('/src/assets/Photos/Caffe Latte.png')",
        'ChickenPasta': "url('/src/assets/Photos/Chicken Pasta.png')",
        'Espresso': "url('/src/assets/Photos/Espresso.png')",
        'RotiBakar': "url('/src/assets/Photos/Roti Bakar.png')",
      }, 
      colors: {
        'brownpage': '#FFFBF2',
        'brownbutton': '#CBBDA6',
        'brownbuttonhover': '#B0A392',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}