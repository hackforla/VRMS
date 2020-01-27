import React, { useContext } from 'react';

import { authContext } from '../context/authContext';

const useAuth = () => {
    return useContext(authContext);
};

export default useAuth;