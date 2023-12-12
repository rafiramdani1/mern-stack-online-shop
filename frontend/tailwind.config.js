/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    fontFamily: {
      URL: ['Poppins']
    },
    extend: {
      colors: {
        textPrimary: '#27272a',
        textSecondary: '#3f3f46',
        textHoverPrimary: '#18181b',
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

