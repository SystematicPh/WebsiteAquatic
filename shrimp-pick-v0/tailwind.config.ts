import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D1B1E",
        sand: "#F6EFE5",
        coral: "#EE6C4D",
        tide: "#1B4965",
        foam: "#EAF4F4",
        seaweed: "#2B5D42"
      },
      boxShadow: {
        soft: "0 20px 50px rgba(13, 27, 30, 0.12)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Trebuchet MS", "Verdana", "sans-serif"]
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
