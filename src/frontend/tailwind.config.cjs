/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b1117",
          900: "#0f1722"
        },
        trust: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488"
        }
      }
    }
  },
  plugins: []
};
