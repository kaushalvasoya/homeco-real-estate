// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // ensure your components/pages are scanned
    './public/**/*.{html,js}'      // optional: scan any static HTML/js in public
  ],
  darkMode: 'class', // use .dark on <html> or <body> to enable dark theme
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f5ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed', // main purple accent
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#34146a'
        },
        deep: {
          900: '#071028',
          800: '#081426'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'xl-strong': '0 20px 50px rgba(2,6,23,0.55)',
        'glass': '0 10px 30px rgba(7,10,25,0.55)'
      },
      backdropBlur: {
        xs: '4px',
        sm: '6px',
        md: '8px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms') /* make sure to npm install -D @tailwindcss/forms */,
    // add plugins here if you want (like typography, aspect-ratio, etc.)
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio')
  ]
};
