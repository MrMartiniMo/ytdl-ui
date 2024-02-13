/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,vue,js}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: true
  }
}
