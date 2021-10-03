module.exports = {
  darkMode: "class", // or 'media' or 'class'
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        //check: "url('/images/icons/2.png')",
        //landscape: "url('/images/icons/2.png')",
      }),
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      inset: ["checked"],
      zIndex: ["hover", "active"],
    },
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
  },
};