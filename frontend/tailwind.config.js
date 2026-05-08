/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // slate-950
        foreground: "#fafafa",
        card: "#18181b", // zinc-900
        "card-foreground": "#fafafa",
        accent: "#6366f1", // indigo-500
        "accent-foreground": "#ffffff",
      },
    },
  },
  plugins: [],
}
