import { createTheme, responsiveFontSizes } from '@mui/material';

import { default as palette, uiKitColors } from './palette';

let theme = createTheme({
  palette,
  typography: {
    fontFamily: [
      'Source Sans Pro',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Source Code Pro',
      fontWeight: 'bold',
      fontSize: '30px',
      marginBottom: '1.5rem',
    },
    h3: {
      fontFamily: 'Source Sans Pro',
      fontWeight: 600,
      fontSize: '16px',
    },
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
          style: { width: '100%', color: uiKitColors.black, border: 'none' },
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
