// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        0.6: '0.15rem',
      },
      colors: {
        primary: colors.teal,
        secondary: colors.gray,
        accent: colors.amber,
      },
    },
  },
  plugins: [],
};
