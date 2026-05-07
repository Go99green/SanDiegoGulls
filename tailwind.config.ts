import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        gulls: {
          orange: '#FC4C02',
          blue: '#0088CE',
          black: '#010101',
          silver: '#BFCED6'
        }
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0,0,0,.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
