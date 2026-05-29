import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: "#050816",
        "mission-blue": "#5B8CFF",
        "signal-cyan": "#00E5FF",
        "alien-violet": "#8B5CF6",
        "warning-amber": "#FFB547",
      },
      boxShadow: {
        "signal": "0 0 32px rgba(0, 229, 255, 0.22)",
        "violet": "0 0 36px rgba(139, 92, 246, 0.24)",
        "amber": "0 0 30px rgba(255, 181, 71, 0.2)",
      },
      backgroundImage: {
        "mission-gradient":
          "linear-gradient(135deg, rgba(0, 229, 255, 0.95), rgba(91, 140, 255, 0.9) 45%, rgba(139, 92, 246, 0.95))",
      },
    },
  },
  plugins: [],
}

export default config
