/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08121f",
        mist: "#f4f7fb",
        accent: "#ff7a18",
        ocean: "#0c5adb",
        pine: "#0f766e",
      },
      boxShadow: {
        panel: "0 20px 60px rgba(8, 18, 31, 0.16)",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
