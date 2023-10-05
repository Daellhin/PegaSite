/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "primary": "#f9984c",
          "--pc": "0 0% 100%"
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": "#f9984c",
        }
      },
    ],
  },
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    require("daisyui")
  ],
  darkMode: 'media',
}
