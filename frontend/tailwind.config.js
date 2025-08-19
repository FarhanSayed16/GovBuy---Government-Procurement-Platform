// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparentBtn1:"#0c87359e",
        transparentBtn2:"#1b3a4bab",
        mainBg:"#fffcf2",
        primary: {
          DEFAULT: '#1B3A4B',  // Deep Navy
          light: '#567D8A',
          dark: '#112B3A',
        },
        secondary: {
          DEFAULT: '#8C1C13',  // Rich Burgundy
          light: '#B33B35',
          dark: '#5D140F',
        },
        accent: {
          DEFAULT: '#D4AF37',  // Gold
          light: '#E6C160',
          dark: '#B9972F',
        },
        neutral: {
          DEFAULT: '#F3F4F6',  // Light gray for backgrounds
          dark: '#374151',     // Dark gray for text
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      // You can also define custom breakpoints if needed:
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
