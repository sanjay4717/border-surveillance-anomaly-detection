/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Tactical HUD palette: deep night-vision green-black base,
        // amber for alerts (radar/sonar convention), cool blue for
        // "all clear" / informational data.
        hud: {
          black: "#0a0d0a",
          panel: "#10160f",
          line: "#1f2b1d",
          green: "#5cf28a",
          dim: "#3a4a38",
          amber: "#ffb020",
          red: "#ff4d4d",
          blue: "#5ec8ff",
          text: "#d8e8d4",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        display: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 12px rgba(92, 242, 138, 0.35)",
        "glow-amber": "0 0 12px rgba(255, 176, 32, 0.4)",
        "glow-red": "0 0 14px rgba(255, 77, 77, 0.45)",
      },
      animation: {
        scan: "scan 3s linear infinite",
        blink: "blink 1.4s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
    },
  },
  plugins: [],
};
