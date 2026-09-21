/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C5CFC',
        'primary-dark': '#6344e0',
        secondary: '#E9D5FF',
        accent: '#F8D7DA',
        lavender: '#f5eefe',
        cream: '#ffe8dc',
        editorial: {
          sage: '#A8B99A',
          'sage-light': '#C5D3B8',
          'sage-dark': '#8FA37E',
          beige: '#E7DFD4',
          cream: '#F7F4EE',
          'cream-dark': '#EDE8DF',
          brown: '#8B6F5A',
          'brown-light': '#A8907A',
          'brown-dark': '#6B5344',
          charcoal: '#2B2B2B',
          'charcoal-light': '#4A4A4A',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        'editorial-serif': ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        'editorial-sans': ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(124, 92, 252, 0.12)',
        'glass-lg': '0 20px 60px rgba(124, 92, 252, 0.18)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 60px rgba(124, 92, 252, 0.2)',
      },
    },
  },
  plugins: [],
};
