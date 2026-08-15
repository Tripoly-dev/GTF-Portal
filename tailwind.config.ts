import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        tight: ['Inter Tight', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        teal: '#0A7B6C',
        'teal-dark': '#065A4F',
        'teal-lt': '#E0F0ED',
        orange: '#E8613A',
        ink: '#071A17',
        'ink-mid': '#2D4A44',
        'ink-light': '#7A9690',
        rule: '#C8DEDA',
        paper: '#EBF2F0',
      },
    },
  },
  plugins: [],
}
export default config
