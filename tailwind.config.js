module.exports = {
  content: ['./src/ui/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
};
