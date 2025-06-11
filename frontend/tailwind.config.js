import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans], // <-- UBAH INI
      },
      colors: {
        "brand-navy": "#2F4156",
        "brand-teal": "#00897B",
        "brand-sky-blue": "#C8D9E6",
        "brand-beige": "#F5EFEB",
      },
      keyframes: {
        "move-bg": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "move-bg": "move-bg 15s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
