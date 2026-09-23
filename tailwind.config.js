/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef1f6',
          100: '#d4d9e6',
          200: '#a8b3cc',
          300: '#7b8db3',
          400: '#4f679a',
          500: '#345080',
          600: '#243d68',
          700: '#1a2e54',
          800: '#152541',
          900: '#0e1a33',
          950: '#070f1f',
        },
        brand: {
          50: '#eff5ff',
          100: '#dce8fd',
          200: '#c2d6fc',
          300: '#94b8f9',
          400: '#5e8df5',
          500: '#3a6bf0',
          600: '#244fd6',
          700: '#1d40ad',
          800: '#1c3887',
          900: '#1c326d',
          950: '#152152',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
