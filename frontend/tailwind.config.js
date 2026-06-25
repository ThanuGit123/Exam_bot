/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        blob: "blob 15s infinite",
        'bar-1': "bar-1 1.5s ease-in-out infinite",
        'bar-2': "bar-2 2s ease-in-out infinite",
        'bar-3': "bar-3 1.8s ease-in-out infinite",
        'bar-4': "bar-4 2.2s ease-in-out infinite",
        'bar-5': "bar-5 1.7s ease-in-out infinite",
        'bar-6': "bar-6 2.1s ease-in-out infinite",
        'bar-7': "bar-7 1.9s ease-in-out infinite",
        'bar-8': "bar-8 2.3s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        'bar-1': { '0%, 100%': { height: '40%' }, '50%': { height: '70%' } },
        'bar-2': { '0%, 100%': { height: '60%' }, '50%': { height: '30%' } },
        'bar-3': { '0%, 100%': { height: '45%' }, '50%': { height: '85%' } },
        'bar-4': { '0%, 100%': { height: '80%' }, '50%': { height: '50%' } },
        'bar-5': { '0%, 100%': { height: '65%' }, '50%': { height: '90%' } },
        'bar-6': { '0%, 100%': { height: '90%' }, '50%': { height: '45%' } },
        'bar-7': { '0%, 100%': { height: '75%' }, '50%': { height: '95%' } },
        'bar-8': { '0%, 100%': { height: '85%' }, '50%': { height: '40%' } },
      },
    },
  },
  plugins: [],
}
