import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    primary: {
      main: '#00008B',
    },
    secondary: {
      main: '#FA114F',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Source Code Pro',
      fontWeight: 'bold',
      fontSize: '30px',
      marginBottom: '1.5rem',
    },
    h3: {
      fontFamily: 'Source Code Pro',
      fontWeight: 'bold',
      fontSize: '28px',
      marginBottom: '1.5rem',
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
            border: '3px solid #00008B',
          },
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        inputProps: {
          style: { width: '100%', border: 'none', color: 'black' },
        },
        fullWidth: true,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: 'black',
            fontFamily: 'Source Sans Pro',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            margin: '0px 0px 0px 0px',
            '&::placeholder': {
              color: '#757575',
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
          color: 'black',
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
