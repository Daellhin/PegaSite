/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    require("daisyui"),
    require('@tailwindcss/line-clamp'),
  ],
  darkMode: 'media',
}
