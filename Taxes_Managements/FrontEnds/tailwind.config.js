/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003f87',
        'primary-container': '#0056b3',
        'on-primary-container': '#bbd0ff',
        secondary: '#1b6d24',
        'secondary-container': '#a0f399',
        'on-secondary-container': '#217128',
        tertiary: '#6e2e00',
        'tertiary-container': '#934000',
        background: '#fcf9f8',
        surface: '#fcf9f8',
        'surface-container': '#f0eded',
        'surface-container-low': '#f6f3f2',
        'surface-container-high': '#eae7e7',
        'surface-container-highest': '#e5e2e1',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#424752',
        'outline-variant': '#c2c6d4',
        error: '#ba1a1a',
      },
      fontFamily: {
        sans: ['"Public Sans"', '"Inter"', 'sans-serif'],
        headline: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
