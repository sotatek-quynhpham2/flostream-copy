import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B78',
        success: '#64C043',
        info: '#18B8BF',
        warning: '#FFC934',
        error: '#FF613A',
        gradient: 'linear-gradient(96deg, #FA4B59 1.88%, #FE8673 66.21%)',
        'neutral-1': '#1E2430',
        'neutral-2': '#3F4654',
        'neutral-3': '#97969D',
        'neutral-4': '#E0E0E4',
        'neutral-5': '#F6F7FB',
      }
    },
  },
  plugins: [],
};
export default config;
