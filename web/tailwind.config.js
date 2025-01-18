let plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Libre Baskerville', 'serif'],
      },
      fontSize: {
        xs: ['0.75rem', '150%'],
        sm: ['0.875rem', '150%'],
        base: ['1rem', '150%'],
        lg: ['1.125rem', '150%'],
        xl: ['1.25rem', '140%'],
        '2xl': ['1.5rem', '140%'],
        '3xl': ['2rem', '130%'],
        '4xl': ['2.5rem', '130%'],
        '5xl': ['3.125rem', '120%'],
      },
      colors: {
        n: {
          5: 'var(--n-5)',
          10: 'var(--n-10)',
          20: 'var(--n-20)',
          40: 'var(--n-40)',
          50: 'var(--n-50)',
          75: 'var(--n-75)',
          85: 'var(--n-85)',
          100: 'var(--n-100)',
          120: 'var(--n-120)',
          140: 'var(--n-140)',
        },
        p: {
          5: 'var(--p-5)',
          10: 'var(--p-10)',
          20: 'var(--p-20)',
          40: 'var(--p-40)',
          55: 'var(--p-55)',
          75: 'var(--p-75)',
          100: 'var(--p-100)',
          120: 'var(--p-120)',
          140: 'var(--p-140)',
          160: 'var(--p-160)',
        },
        chip: 'var(--chip)',
        banner: {
          'get-matched': 'var(--banner-get-matched)',
          emergency: 'var(--banner-emergency)',
        },
        variant: {
          50: 'var(--primary-variant-50)',
          75: 'var(--primary-variant-75)',
          100: 'var(--primary-variant-100)',
        },
        background: 'var(--background)',
        highlight: 'var(--highlight)',
        surface: 'var(--surface)',
        regular: 'var(--text-regular)',
        heading: 'var(--text-heading)',
        hint: 'var(--text-hint)',
        inverted: 'var(--text-inverted)',
        graphics: {
          10: 'var(--graphics-10)',
          20: 'var(--graphics-20)',
          30: 'var(--graphics-30)',
          50: 'var(--graphics-50)',
          70: 'var(--graphics-70)',
          100: 'var(--graphics-100)',
        },
        favorites: 'var(--favorites)',
        error: {
          1: 'var(--error-1)',
          2: 'var(--error-2)',
        },
        warning: {
          1: 'var(--warning-1)',
          2: 'var(--warning-2)',
          3: 'var(--warning-3)',
        },
      },
      borderColor: {
        DEFAULT: 'var(--n-50)',
        light: 'var(--n-40)',
      },
      divideColor: {
        DEFAULT: 'var(--n-50)',
        light: 'var(--n-40)',
      },
      keyframes: {
        loader: {
          '0%': {
            left: '-40%',
          },
          '50%': {
            left: '20%',
            width: '30%',
          },
          '80%': {
            left: '70%',
            width: '30%',
          },
          '100%': {
            left: '100%',
            width: '100%',
          },
        },
      },
      animation: {
        loader: 'loader 1s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    plugin(function ({ addVariant }) {
      addVariant('details-marker', ['&::-webkit-details-marker', '&::marker']);
      addVariant('bcbs', '[data-organization=bcbsks] &');
    }),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          size: (value) => ({ width: value, height: value }),
        },
        { values: theme('height') },
      );
    }),
  ],
};
