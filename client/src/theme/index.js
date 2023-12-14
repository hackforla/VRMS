import { createTheme, responsiveFontSizes } from '@mui/material';

import { default as palette, uiKitColors } from './palette';

let theme = createTheme({
  palette,
  typography: {
    // to achieve the same font as original
    fontFamily: ['aliseoregular',
     '-apple-system',
      'BlinkMacSystemFont', 
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',].join(','),
    h1: {
      fontWeight: 'bold',
      // size copied from index.scss
      fontSize: '7rem',
      // crafted to achieve the same spacing as original page
      marginTop: '-1.6rem',
    },
    // newly added style
    h2: {
      // size copied from index.scss
      fontSize: '2.8rem',
      // crafted to achieve the same spacing as original page
      marginTop: '-1.6rem', 
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: 'Source Sans Pro',
      fontWeight: 600,
      fontSize: '16px',
    },
    h4: {
      // size copied from index.scss
      fontSize: '2rem',
      // crafted to achieve the same spacing as original page
      fontWeight: 'bold',
      marginTop: '-0.6rem',
      marginBottom: '-0.6rem',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Source Sans Pro',
          fontSize: '18px',
          fontWeight: '600',
          textTransform: 'none',
        },
      },
      variants: [
        {
          props: { variant: 'secondary' },
          style: {
            // border: `3px solid ${uiKitColors.secondary}`,
            // Temporary hacky fix, uiKit calls for a "secondary" variant that doesn't use MUI theme's secondary color
            border: `3px solid ${uiKitColors.primary}`,
          },
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        inputProps: {
          style: { width: '100%', color: uiKitColors.black, border: 'none', paddingLeft: '0.5em' },
        },
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: `1px solid ${uiKitColors.black}`,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: uiKitColors.black,
            fontFamily: 'Source Sans Pro',
            fontSize: '14px',
            fontWeight: '500',
            margin: '0px 0px 0px 0px',
            '&::placeholder': {
              color: uiKitColors.grayscale[4],
              fontSize: '14px',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: uiKitColors.black,
          fontFamily: 'Source Sans Pro',
          fontWeight: '600',
          fontSize: '16px',
          marginBottom: '0.25rem',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
