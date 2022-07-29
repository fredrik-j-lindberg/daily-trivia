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
        background: colors.gray[800],
        action: {
          regular: colors.amber[200],
          hover: colors.amber[300],
        },
        neutral: colors.gray[400],
        correct: colors.teal[400],
        incorrect: colors.red[400],
        accent: colors.teal[300],
      },
    },
    textColor: {
      accent: colors.teal[300],
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      link: colors.blue,
    },
  },
  plugins: [],
};
