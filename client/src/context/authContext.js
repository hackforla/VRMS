import React, { useState, useEffect, createContext } from 'react';

export const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();

    return <authContext.Provider value={auth}>
                { children }
            </authContext.Provider>
};

function useProvideAuth() {
    const [isAdmin, setIsAdmin] = useState(null);
    const [user, setUser] = useState(null);
    // const [userId, setUserId] = useState(null);

    // const isAdmin = async (userId) => {
    //     console.log('isAdmin tentatively ran');

    //     try {
            // fetch('/api/users?email=bonnie@hackforla.org')
            //     .then(response => response.json())
            //     .then(resJson => {
            //         if (resJson.toString() === '5e1d2df6316d2f00172ef09e') {
            //             console.log('It happened to be true');
            //             setUserId(resJson);
            //             setUser(true);
            //         } else {
            //             console.log('It was definitely false what were you thinking');
            //             setUser(false);
            //         }
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     })
            
        const login = async (email) => {
            try {
                const response = await fetch(`/api/users?email=${email}`);
                const userId = await response.json();

                const userResponse = await fetch(`/api/users/${userId}`);
                const user = await userResponse.json();

                if(user.accessLevel === 'admin') {
                    console.log('Hey... that worked...');
                    setUser(user);
                    setIsAdmin(true);
                    return true;
                } else {
                    console.log('Nope not gonna work');
                    setIsAdmin(false);
                    return false;
                }
            } catch(error) {
                console.log(error);
            }
        }

            
    //     } catch(error) {
    //         console.log(error);
    //     }
    // }

    // const signin = (isLoggedIn) => {
    //     if(isLoggedIn) {
    //         return setUser(isLoggedIn);
    //     }
        
    // }

    useEffect(() => {
        console.log(user);

        // const isTrue = () => {
        //     console.log(userId === '5e1d2df6316d2f00172ef09e');
        //     return userId === '5e1d2df6316d2f00172ef09e' ? setUser(true) : setUser(false);
        // }
        // // login/subscribe
        // // user === true;
        // // // login/unsubscribe
        // return () => isTrue;
        // return () => {isAdmin()}
    }, []);

    return { user, isAdmin, login };
};




