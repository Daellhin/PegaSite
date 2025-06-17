/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  // daisyui: {
  //   themes: [
  //     {
  //       light: {
  //         ...require("daisyui/src/theming/themes")["light"],
  //         "primary": "#f9984c",
  //         "--pc": "0 0 100%"
  //       },
  //       dark: {
  //         ...require("daisyui/src/theming/themes")["dark"],
  //         "primary": "#f9984c",
  //       }
  //     },
  //   ],
  // },
  // plugins: [
  //   require("daisyui")
  // ],
  important: true,
  theme: {
    extend: {},
  },
  darkMode: 'media',
}
