// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        0.8: '0.2rem',
      },
      colors: {
        background: colors.gray[800],
        foreground: colors.gray[700],
        action: {
          regular: colors.amber[200],
          hover: colors.amber[300],
        },
        disabled: colors.gray[400],
        neutral: colors.gray[400],
        correct: colors.teal[400],
        incorrect: colors.red[400],
        accent: colors.teal[300],
      },
      screens: {
        betterhover: { raw: '(hover: hover)' },
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
