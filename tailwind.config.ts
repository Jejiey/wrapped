import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-0": "white",
        "gradient-1": "linear-gradient(43deg, #FFF2A5 0%, #FCD505 100%)",
        "gradient-2": "linear-gradient(43deg, #61CCF6 0%, #0055A6 100%)",
        "gradient-3": "linear-gradient(43deg, #FB9CC9 0%, #EF4880 100%)",
        "gradient-4": "linear-gradient(43deg, #7BCDD8 0%, #2D8E95 100% )",
        "gradient-5": "linear-gradient(43deg, #C282D4 0%, #482C77 100%)",
        "gradient-6": "linear-gradient(43deg, #E7899C 0%, #F87541 100%)",
        "gradient-7": "linear-gradient(43deg, #AADB90 0%, #46AD2B 100%)",
        "gradient-8": "linear-gradient(43deg, #AD1485 0%, #ECAE11 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
