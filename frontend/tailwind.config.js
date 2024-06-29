/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    fontFamily: {
      URL: ['Poppins']
    },
    extend: {
      colors: {
        textPrimary: '#262626',
        textSecondary: '#3f3f46',
        textPrimaryLight: '#d4d4d4',
        textSecondaryLight: '#e5e5e5',
        colorTealPrimary: '#0f766e',
        colorTealSecondary: '#0d9488',
        textHoverPrimary: '#18181b',
        bgPrimaryDark: '#171717',
        bgSecondaryDark: '#262626',
        borderButton: '#a1a1aa',
        hoverBgButton: '#3f3f46',
        ringFocusBtn: '#d4d4d8',
        bgTable: '#fafafa',
        textHeadTable: '#3f3f46',
        textContentTable: '#71717a',
        bgInput: '#fafafa',
        borderInput: '#d4d4d8',
        focusRingInput: '#52525b',
        focusBorderInput: '#52525b'
      }
    },
  },
  plugins: [],
}

