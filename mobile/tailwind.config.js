/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand-Bold", "sans-serif"],
        bevietnam: ["BeVietnamPro-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
}
