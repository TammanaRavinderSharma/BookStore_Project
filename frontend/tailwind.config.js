/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' }, // Start hidden and slightly down
          '100%': { opacity: '1', transform: 'translateY(0)' },  // End visible and in place
        },
      },
      animation: {
        'fade-in-up': 'fadeIn 0.5s ease-out forwards', // Register a utility class
      },
      colors: {
        'primary': '#FFCE1A',
        'secondary' : "#0D0842",
        'blackBG': '#F3F3F3',
        'Favorite': '#FF5841'
      }, 
      fontFamily: {
        'primary' : ["Montserrat", "sans-serif"],
        'secondary' : ["Nunito Sans", "sans-serif"]
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
