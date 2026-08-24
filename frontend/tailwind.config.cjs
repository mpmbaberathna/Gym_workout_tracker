/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: 'var(--color-brand-dark)',
          light: 'var(--color-brand-light)',
          accent: 'var(--color-brand-accent)',
          gray: 'var(--color-brand-gray)',
          border: 'var(--color-brand-border)',
          card: 'var(--color-brand-card)',
          primary: 'var(--color-brand-primary)',
          'primary-text': 'var(--color-brand-primary-text)',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1)', // stronger shadow for depth
      }
    },
  },
  plugins: [],
};
