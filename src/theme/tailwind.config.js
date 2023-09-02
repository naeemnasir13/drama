/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#222222',
        secondary: '#5A5A60',
        tertiary: '#0079CF',
        background: '#000000',
        header: '#262626',
        // lightgrey: '#7A7A7A',
        blue: '#009CD7',
        lightgrey: '#5B5A60',
        red: "#EA181D"
      }
    },
  },
  plugins: [],
}

