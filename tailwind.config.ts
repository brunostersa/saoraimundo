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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-white/10',
    'bg-white/20',
    'bg-white/5',
    'border-white/20',
    'border-white/30',
    'text-white/50',
    'placeholder-white/50',
    'bg-green-500/20',
    'bg-red-500/20',
    'border-green-400/30',
    'border-red-400/30'
  ]
}

export default config
