import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {},
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
