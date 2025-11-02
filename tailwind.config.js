/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Principal Yamaha - Azul y Blanco
        'yamaha-blue': {
          DEFAULT: '#0D47A1',
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#0D47A1',
          600: '#0B3D8C',
          700: '#093377',
          800: '#072962',
          900: '#051F4D',
        },
        'yamaha-dark': {
          DEFAULT: '#1A1A1A',
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#1A1A1A',
          600: '#161616',
          700: '#121212',
          800: '#0D0D0D',
          900: '#090909',
        },
        'yamaha-accent': {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
      },
      
      fontFamily: {
        'yamaha': ['Montserrat', 'sans-serif'],
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-yamaha': 'linear-gradient(135deg, #0D47A1 0%, #42A5F5 100%)',
        'gradient-yamaha-dark': 'linear-gradient(135deg, #051F4D 0%, #0D47A1 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFA000 0%, #FFC107 100%)',
      },

      boxShadow: {
        'yamaha': '0 10px 40px -10px rgba(13, 71, 161, 0.4)',
        'yamaha-lg': '0 20px 60px -15px rgba(13, 71, 161, 0.5)',
        'glow-blue': '0 0 20px rgba(13, 71, 161, 0.5)',
        'glow-accent': '0 0 20px rgba(255, 193, 7, 0.5)',
      },

      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },

      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* IE and Edge */
          '-ms-overflow-style': 'none',
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          /* Chrome, Safari and Opera */
          'display': 'none',
        },
      })
    },
  ],
}