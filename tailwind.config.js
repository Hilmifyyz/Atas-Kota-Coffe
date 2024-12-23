/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default { 
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'Logo': "url('/src/assets/Photos/Logo.png')",
        'LogoMini': "url('/src/assets/Photos/Logo Mini.png')",
        'LogoFooter': "url('/src/assets/Photos/Logo Cropped.png')",
        'LogoPutih': "url('/src/assets/Photos/LogoPutih.png')",
        'PhoneIcon': "url('/src/assets/Photos/material-symbols_call.png')",
        'Coffee': "url('/src/assets/Photos/Coffee.png')",
        'Alfredo': "url('/src/assets/Photos/Alfredo Pasta.png')",
        'CaffeLatte': "url('/src/assets/Photos/Caffe Latte.png')",
        'ChickenPasta': "url('/src/assets/Photos/Chicken Pasta.png')",
        'Espresso': "url('/src/assets/Photos/Espresso.png')",
        'RotiBakar': "url('/src/assets/Photos/Roti Bakar.png')",
        'ClockIcon': "url('/src/assets/photos/Clock.png')",
        'LocationIcon': "url('/src/assets/photos/Loc.png')",
        'AccountIcon': "url('/src/assets/photos/Person.png')",
        'StarIcon': "url('/src/assets/photos/Star.png')",
        'HalfStarIcon': "url('/src/assets/photos/Half Star.png')",
        'CheckIcon': "url('/src/assets/photos/Checked.png')",
        'CoffeeIcon': "url('/src/assets/photos/vaadin_coffee.png')",
        'CakeIcon': "url('/src/assets/photos/CakeIcon.png')",
        'FoodIcon': "url('/src/assets/photos/FoodIcon.png')",
        'DrinkIcon': "url('/src/assets/photos/DrinkIcon.png')",
        'SearchIcon': "url('/src/assets/photos/Search.png')",
        'PlusCartIcon': "url('/src/assets/photos/PlusCart.png')",
        'GoogleIcon': "url('/src/assets/Photos/Icon/devicon_google.png')",
        'MandiriIcon': "url('/src/assets/Photos/Icon/Mandiri.png')",
        'BNIIcon': "url('/src/assets/Photos/Icon/BNI.png')",
        'BCAIcon': "url('/src/assets/Photos/Icon/BCA.png')",
        'QRISIcon': "url('/src/assets/Photos/Icon/QRIS.png')",
        'DanaIcon': "url('/src/assets/Photos/Icon/Dana.png')",
        'WalletIcon': "url('/src/assets/Photos/Icon/solar_wallet-linear.png')",
      }, 
      colors: {
        'brownpage': '#FFFBF2',
        'brownbutton': '#CBBDA6',
        'brownbuttonhover': '#B0A392',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      animation: {
        'slideUp': 'slideUp 0.3s ease-out',
        'slideDown': 'slideDown 0.3s ease-out'
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.custom-spinner::-webkit-inner-spin-button': {
          appearance: 'none',
          margin: '0',
        },
        '.custom-spinner::-webkit-outer-spin-button': {
          appearance: 'none',
          margin: '0',
        },
        '.custom-spinner': {
          '-moz-appearance': 'textfield', // For Firefox
        },
      });
    }),
  ],
}