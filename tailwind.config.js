// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "custom-orange": "#F47920",
        "custom-light-orange": "#F4CFB7",
        "custom-dark-gray": "#4b4b4b",
        "custom-black": "#070707",
        "custom-dark-red": "#730300",
      },
    },
  },
  plugins: [],
};
