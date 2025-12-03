/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#5865F2",
          "secondary": "#EB459E",
          "accent": "#00D9FF",
          "neutral": "#2F3136",
          "base-100": "#202225",
          "info": "#00D9FF",
          "success": "#57F287",
          "warning": "#FEE75C",
          "error": "#ED4245",
        },
      },
    ],
    darkTheme: "dark",
  },
}




