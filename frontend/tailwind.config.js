/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        seazone: {
          navy: '#00143D',
          navyDark: '#000A24',
          blue: '#0055FF',
          blueLight: '#3377FF',
          blueDark: '#003ECC',
          coral: '#FC6058',
          coralLight: '#FF7D76',
          coralDark: '#E04840',
          bg: '#050B1A',
          card: '#0A1530',
          cardBorder: 'rgba(0, 85, 255, 0.25)',
          cardHover: '#0E1E45'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
