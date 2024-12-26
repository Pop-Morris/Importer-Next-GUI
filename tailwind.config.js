/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bc-background': '#F6F7F9',
        'bc-text': '#313440',
        'bc-text-secondary': '#5C6070',
        'bc-border': '#D9DCE9',
        'bc-blue': '#3C64F4',
        'bc-blue-hover': '#2852EB',
        'bc-disabled': '#E6E8EC',
        'bc-disabled-text': '#919BAE',
      }
    },
  },
  plugins: [],
} 