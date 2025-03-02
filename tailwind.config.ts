/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // If using src directory
  ],
  theme: {
    extend: {
      colors: {
        background: "#5146e3",
        card: "#202329",
      },
    },
  },
  plugins: [],
};
