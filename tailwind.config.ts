import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        success: '#55B938',
        warning: '#EAC645',
        danger: '#D65745',
        info: '#5296D5',
      },
    },
  },
  plugins: [],
};
export default config;
