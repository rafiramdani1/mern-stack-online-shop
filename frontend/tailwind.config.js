/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        textPrimary: '#3f3f46',
        textSecondary: '#52525b',
        textHoverPrimary: '#27272a',
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

