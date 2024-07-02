/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,tsx,ts}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        'chat': '20% 80%'
      },
      width: {
        'custom_margin': 'calc(100% - 1.5rem)'
      }
    },
  },
  plugins: [],
}

