/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan all files in src
    "./pages/**/*.{js,jsx,ts,tsx}", // if using Next.js pages directory
    "./components/**/*.{js,jsx,ts,tsx}", // reusable components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
