/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3d9392", // Teal/Sea Green
        "primary-container": "#4fa3a2",
        secondary: "#d17b60", // Terracotta/Rust
        "secondary-container": "#e29c85",
        tertiary: "#cba55c", // Gold (Accent)
        accent: "#cba55c",
        background: "#fcf9f8",
        surface: "#fcf9f8",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-surface": "#1c1b1b",
        "outline-variant": "#bec9c8",

        // Additional theme colors matching raw Stitch colors
        "on-primary-fixed": "#002020",
        "secondary-fixed-dim": "#ffb59e",
        "primary-fixed-dim": "#81d4d3",
        "on-error": "#ffffff",
        "inverse-on-surface": "#f3f0ef",
        "surface-container-high": "#eae7e7",
        "surface-variant": "#e5e2e1",
        "tertiary-fixed": "#ffdea5",
        "surface-tint": "#006a69",
        "on-tertiary-fixed-variant": "#5d4200",
        "on-background": "#1c1b1b",
        "on-secondary-fixed": "#3a0b00",
        "surface-bright": "#fcf9f8",
        "outline": "#6e7979",
        "on-secondary-container": "#78351f",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#e9c175",
        "on-tertiary-container": "#fffbff",
        "on-surface-variant": "#3e4948",
        "surface-container-low": "#f6f3f2",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#00504f",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e5e2e1",
        "surface-dim": "#dcd9d9",
        "tertiary-container": "#906f2c",
        "secondary-fixed": "#ffdbd0",
        "inverse-primary": "#81d4d3",
        "on-secondary-fixed-variant": "#75331d",
        "inverse-surface": "#313030",
        "surface-container": "#f0eded",
        "on-tertiary-fixed": "#261900",
        "on-primary-container": "#f3fffe",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#9ef1ef",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "container-max": "1440px",
        gutter: "24px",
        base: "8px"
      },

      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
}
