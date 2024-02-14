/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{html,vue,js}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: true
  }
}
