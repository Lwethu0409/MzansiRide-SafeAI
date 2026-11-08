import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#0d0e10',
        card: '#1b1c20',
        card2: '#24262b',
        tx: '#f3f4f6',
        mu: '#8b8f98',
        ac: '#1fd6a0',
        am: '#f5a524',
        rd: '#ef4444',
        ln: '#2b2d33',
        ink: '#04241b',
        'ac-bg': '#10261f',
        'ac-bd': '#14614b',
        'am-bg': '#2a2110',
        'am-bd': '#5a4210',
        'rd-bg': '#2a1214',
        'rd-tx': '#ff8a8a',
      },
      keyframes: {
        'pulse-dot': { '50%': { opacity: '0.3' } },
        ring: {
          from: { transform: 'scale(.6)', opacity: '0.9' },
          to: { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.4s infinite',
        ring: 'ring 1.4s infinite',
      },
    },
  },
  plugins: [
    // Desktop layout switch: <body class="desk"> turns on every `desk:` utility.
    plugin(({ addVariant }) => {
      addVariant('desk', 'body.desk &');
    }),
  ],
} satisfies Config;
