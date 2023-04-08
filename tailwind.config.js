module.exports = {
  content: ['./src/ui/**/*.tsx'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  variants: {
    extend: {
        display: ["group-hover"],
    },
  },
};
