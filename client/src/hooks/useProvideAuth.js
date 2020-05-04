import React, { useState, useEffect } from 'react';

import Firebase from '../firebase';

export default function useProvideAuth() {
    const [isAdmin, setIsAdmin] = useState(null);
    const [user, setUser] = useState();

    useEffect(() => {
        if (!user) {
            Firebase.login();
        };
        
        Firebase.auth.onAuthStateChanged(user => {
            // console.log('Handling auth change with ', user);

            if (user) {
                setUser(user);
            } else {
                setUser(null);
            };
        });
        
    }, []);

    // console.log(user);

    // return { user, isAdmin, login };
    return { user, isAdmin };
};

