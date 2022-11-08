/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        112: "28rem",
        128: "32rem",
      },
      colors: {
        appointment: {
          green: "#43ad94",
          "green-dark": "#3da18a",
          blue: "#5b919a",
          "blue-dark": "#548790",
        },
        black: {
          DEFAULT: "#000",
          50: "#F8F9FA",
          100: "#F1F3F4",
          200: "#E8EAED",
          300: "#DADCE0",
          400: "#BDC1C6",
          500: "#9AA0A6",
          600: "#80868B",
          700: "#36393f",
          800: "#2f3136",
          900: "#202225",
          1000: "#000",
        },
      },
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite",
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover", "dark"],
      pointerEvents: ["group-hover"],
      color: ["disabled"],
      cursor: ["disabled"],
      opacity: ["disabled"],
      visibility: ["group-hover"],
    },
  },
  plugins: [],
}
