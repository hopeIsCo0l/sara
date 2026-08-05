/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kith: {
          bg: 'var(--kith-bg)',
          subBg: 'var(--kith-sub-bg)',
          card: 'var(--kith-card)',
          innerCard: 'var(--kith-inner-card)',
          border: 'var(--kith-border)',
          borderLight: 'var(--kith-border-light)',
          bone: 'var(--kith-bone)',
          offwhite: 'var(--kith-offwhite)',
          muted: 'var(--kith-muted)',
          darkMuted: 'var(--kith-dark-muted)',
          accent: 'var(--kith-accent)',
          btnPrimaryBg: 'var(--kith-btn-primary-bg)',
          btnPrimaryText: 'var(--kith-btn-primary-text)',
          btnPrimaryHover: 'var(--kith-btn-primary-hover)',
          btnSecondaryBg: 'var(--kith-btn-secondary-bg)',
          btnSecondaryText: 'var(--kith-btn-secondary-text)',
          btnSecondaryBorder: 'var(--kith-btn-secondary-border)',
          btnSecondaryHover: 'var(--kith-btn-secondary-hover)',
          overlayBg: 'var(--kith-overlay-bg)',
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        superwide: '0.25em',
        kith: '0.18em',
      },
      gridTemplateColumns: {
        'catalog-4': 'repeat(4, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
