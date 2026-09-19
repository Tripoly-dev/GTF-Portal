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
        tight: ['var(--font-sans)'],
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        teal: '#0A7B6C',
        brand: '#0A5F54',
        'teal-dark': '#074A42',
        'teal-lt': '#DCEFEA',
        ink: '#0A1D1A',
        'ink-mid': '#33504A',
        'ink-light': '#4F6964',
        rule: '#D5E2DE',
        paper: '#E9EFED',
      },
    },
  },
  plugins: [],
}
export default config
