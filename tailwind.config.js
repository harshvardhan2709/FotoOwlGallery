/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      spacing: {
        13: '52px',
        18: '72px',
        22: '88px',
      },
      colors: {
        brand: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          500: '#111111',
          900: '#0F172A',
        },
      },
    },
  },
  plugins: [],
};
