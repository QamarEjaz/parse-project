module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      minWidth: {
        0: '0',
        5: '5rem',
        full: '100%',
      },
      fontSize: {
        xxxxs: '.3rem',
        xxxs: '.5rem',
        xxs: '.625rem',
        xs: '.75rem',
        sm: '.875rem',
        tiny: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.375rem',
        '3xl': '1.5rem',
        '4xl': '2.5rem',
        '5xl': '2.75rem',
        '6xl': '3rem',
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem',
        '10xl': '9rem',
        '11xl': '10rem',
        '12xl': '11rem',
        '13xl': '12rem',
        '14xl': '13rem',
        '15xl': '14rem',
        '16xl': '15rem',
        '17xl': '16rem',
        '18xl': '17rem',
        '23xl': '22rem',
        '33xl': '32rem',
      },
      colors: {
        black: '#000',
        white: '#fff',
        dirtyGreen: '#5AA46',
        main: {
          display: '#15181C',
          body: '#282E36',
          bg: '#FFFFFF',
          intuit: '#1877F2',
          goolgeplus: '#E94538',
          linkedln: '#0A66C2',
          primary: '#0F1114',
          overlay: '#b9b9b9',
          900: '#414C58',
          800: '#576575',
          700: '#6C7E93',
          600: '#98A5B3',
          500: '#C4CBD4',
          400: '#E8EBEE',
          300: '#F6F7F8',
        },
        brand: {
          green: {
            400: '#F5FEFA',
            500: '#E2FDF0',
            600: '#9FF9CE',
            700: '#6FF6B5',
            800: '#10EF83',
            900: '#0CB664',
            1000: '#0BA85C',
          },
          dark: '#066035',
          yellow: '#FFD954',
          fiolet: '#8C6FFF',
        },
        system: {
          danger: '#DF2727',
          success: '#0A9954',
          warning: '#F5BF00',
        },
        mobile: {
          white: {
            800: '#8D8D8D',
            700: '#B3BEBA',
            600: '#EAEAEA',
            500: '#ECECEC',
            400: '#899E97',
            300: '#E4E5EA',
            200: '#F5F5F5',
            100: '#FBFBFB',
            50: '#FFFFFF',
          },
          grey: {
            800: '#6c675c', //108, 103, 92
            700: '#717171', //113, 113, 113
            600: '#707070', //112, 112, 112
            500: '#969696', //150, 150, 150
            400: '#b9b9b9', //185, 185, 185
            300: '#c6c5c2', //198, 197, 194
            200: '#e4e4e4', //228, 228, 228
            100: '#ecebe9', //236, 235, 233
            50: '#fafaf7', //250, 250, 247
          },
          green: {
            1000: '#0BA85C',
            900: '#00D54F',
            800: '#00BD46',
            50: '#5faa46', //95, 170, 70
          },
          red: {
            1000: '#FF0808',
          },
          black: {
            1000: '#000000',
          },
          brown: {
            200: '#707070',
            100: '#A5A5A5',
            50: '#DDDDDD',
          },
          blue: {
            800: '#1E40AF', //108, 103, 92
            700: '#1D4ED8', //113, 113, 113
            600: '#2563EB', //112, 112, 112
            500: '#3B82F6', //150, 150, 150
            400: '#60A5FA', //185, 185, 185
            300: '#93C5FD', //198, 197, 194
            200: '#BFDBFE', //228, 228, 228
            100: '#DBEAFE', //236, 235, 233
            50: '#EFF6FF', //250, 250, 247
          },
          system: {
            green: '#1CA85C',
            red: '#EF2C2C',
            pink: '#FB56C0',
          },
        },
        form: {
          black: {
            1000: '#000000',
          },
          white: {
            1000: '#ffffff',
          },
          blue: {
            50: '#f1f3ff',
          },
          grey: {
            50: '8e8e8e',
          },
        },
      },

      fontFamily: {
        'open-sans': ['"Open Sans"'],
        airbnb: ['"Airbnb Cereal App"'],
      },
      transitionDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        500: '500ms',
        600: '600ms',
        700: '700ms',
        800: '800ms',
        900: '900ms',
        1000: '1000ms',
        1100: '1100ms',
        1200: '1200ms',
        1300: '1300ms',
        1400: '1400ms',
        1500: '1500ms',
        1600: '1600ms',
        1700: '1700ms',
        1800: '1800ms',
        1900: '1900ms',
        2000: '2000ms',
      },
      width: {
        112: '28rem',
      },
    },
  },
  variants: {
    extend: {
      textColor: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
