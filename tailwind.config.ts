import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "serif"],
      },
      colors: {
        pine: "#6b7c4a",
        sand: "#f5f0e8",
        "warm-gold": "#c8883a",
        primary: {
          DEFAULT: "#00628f",
          container: "#007cb3",
        },
        surface: {
          DEFAULT: "#faf7f2",
          "container-low": "#f5f0e8",
          "container": "#eeeae3",
          "container-high": "#e7e2da",
          "container-highest": "#dfd9cf",
        }
      },
    },
  },
  plugins: [],
};
export default config;
