/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        c0: "#101010",
        c1: "#131313",
        c2: "#202329",
        c3: "#8B8D93",
        c4: "#6b8afd",
        c5: "#2E343D",
      },
    },
  },
  plugins: [],
};

