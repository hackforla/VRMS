import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    primary: {
      main: '#00008B',
    },
    secondary: {
        main: "#FA114F",
  },
  typography: {
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
          fontWeight: '600',
          textTransform: 'none',
          padding: '0.5rem 2rem',
        },
      },
      variants: [
        {
          props: { variant: 'secondary' },
          style: {
            border: '2px solid #00008B',
          },
        },
      ],
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
