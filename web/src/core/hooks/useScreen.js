import useMatchMedia from './useMatchMedia';

// https://tailwindcss.com/docs/screens
let screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export function useScreen(size) {
  return useMatchMedia(`(min-width: ${screens[size]})`);
}
