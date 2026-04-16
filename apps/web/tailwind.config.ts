import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        box_1: 'rgb(var(--box_1))',
        card: 'rgb(var(--card))',
        border: 'rgb(var(--border))',
      },
    },
  },
  plugins: [],
}

export default config
