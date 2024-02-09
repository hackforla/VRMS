import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: '',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarState({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
      >
        <Alert
          icon={false}
          onClose={hideSnackbar}
          severity={snackbarState.severity || 'info'}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};