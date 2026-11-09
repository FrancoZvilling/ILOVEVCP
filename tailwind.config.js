/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#0B0B0E',
          card: '#141418',
          surface: '#1C1C22',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F5EDDC',
          200: '#EBD8B8',
          300: '#E0C294',
          400: '#E5C07B',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8C6508',
          border: 'rgba(212, 175, 55, 0.22)',
          glow: 'rgba(212, 175, 55, 0.15)',
        },
        text: {
          primary: '#F5F5F7',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E5C07B 0%, #D4AF37 50%, #B8860B 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(20, 20, 24, 0.95) 0%, rgba(11, 11, 14, 0.98) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
