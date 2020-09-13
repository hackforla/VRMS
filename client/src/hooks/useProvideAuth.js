import { useState, useEffect } from 'react';

import Firebase from '../firebase';

export default function useProvideAuth() {
    // TODO: Remove this statement and replace with magic link rendering. Until we have 
    // a functional admin variable, the admin page will not render for the user.
    const isAdmin = false;
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
        
    }, [user]);

    // console.log(user);

    // return { user, isAdmin, login };
    return { user, isAdmin };
};

