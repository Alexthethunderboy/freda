/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFF0F5',
        gradientTop: '#FFD6E8',
        gradientBottom: '#FFE3A9',
        accentPink: '#FF8DC7',
        accentYellow: '#FFD93D',
        accentBlue: '#A5D8FF',
        textPrimary: '#333333',
        textSecondary: '#6B7280',
        cream: '#FFF8E7',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        dancing: ['var(--font-dancing)', 'cursive'],
      },
    },
  },
  plugins: [],
};
