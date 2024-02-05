import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({children}) => {
    const [error, setError] =  useState();

    const showError = (message) =>{
        setError(message);
    }

    const clearError = () =>{
        setError("");
    };

    return (
        <SnackbarContext.Provider>
            {children}
            <Snackbar
                open = {!!error}
                autoHideDuration={4000}
                onClose={clearError}
            >
                <Alert severity='error' onClose={clearError}>
                    {error}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
      throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
  };