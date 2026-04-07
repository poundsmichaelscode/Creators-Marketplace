import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: '#7C6CFF', dark: '#6D5EF5' } } } },
  plugins: [],
};
export default config;
