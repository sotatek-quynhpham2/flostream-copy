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
        flos: '#1F3832',
        disableBtn: '#999999',
        baseText: '#292929',
        secondText: '#4C4C4C',
        colorBorder: '#BFBFBF',
        textInput: '#1F3832',
        grayFlo: '#F2F2F2',
        textBlue: '#0066CC'
      },
    },
  },
  plugins: [],
};
export default config;
