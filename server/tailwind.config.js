/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
    './dist/**/*.{js,html,css}',  // Ajoutez cette ligne pour inclure les fichiers générés
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        textColor: 'var(--text-color)',
      },
      fontFamily: {
        sans: ['var(--font-family)', 'sans-serif'],
      },
      fontSize: {
        base: 'var(--font-size)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}