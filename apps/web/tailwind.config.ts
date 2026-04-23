import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        dk_grey: 'rgb(var(--dk_grey))',
        lg_grey: 'rgb(var(--lg_grey))',
        dk_border: 'rgb(var(--dk_border))',
      },
    },
  },
  plugins: [],
}

export default config
