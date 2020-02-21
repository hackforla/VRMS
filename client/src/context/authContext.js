import React, { createContext, useState } from 'react';

import useProvideAuth from '../hooks/useProvideAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const auth = useProvideAuth();

    return (
        <AuthContext.Provider value={auth}>
            { children }
        </AuthContext.Provider>
    );
};