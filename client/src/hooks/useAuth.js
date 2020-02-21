import React, { useContext } from 'react';

import { AuthContext } from '../context/authContext';

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;