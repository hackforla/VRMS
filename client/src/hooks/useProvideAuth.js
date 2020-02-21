import React, { useState, useEffect } from 'react';

import Firebase from '../firebase';

export default function useProvideAuth() {
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
            
        // const login = async (email) => {
        //     try {
        //         const auth = Firebase.login();

        //         console.log(auth);
        //         // const response = await fetch(`/api/users?email=${email}`);
        //         // const userId = await response.json();

        //         // const userResponse = await fetch(`/api/users/${userId}`);
        //         // const user = await userResponse.json();

        //         // if(user.accessLevel === 'admin') {
        //         //     console.log('Hey... that worked...');
        //         //     setUser(user);
        //         //     setIsAdmin(true);
        //         //     return true;
        //         // } else {
        //         //     console.log('Nope not gonna work');
        //         //     setIsAdmin(false);
        //         //     return false;
        //         // }
        //         setUser(true);
        //         setIsAdmin(true);
        //         return true;

        //     } catch(error) {
        //         console.log(error);
        //         return false;
        //     }
        // }

            
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
        Firebase.login()
            .then(result => {
                if (result) {
                    console.log(result.user.email);
                    setUser(result.user.email);
                }
            });
        
        // const user = Firebase.login();

        // setUser(user);
        // console.log(user);

            // async function handleAuth() {
            //     const auth = await Firebase.login();
            //     console.log(auth);
            // }

            // handleAuth();
            // const response = await fetch(`/api/users?email=${email}`);
            // const userId = await response.json();

            // const userResponse = await fetch(`/api/users/${userId}`);
            // const user = await userResponse.json();

            // if(user.accessLevel === 'admin') {
            //     console.log('Hey... that worked...');
            //     setUser(user);
            //     setIsAdmin(true);
            //     return true;
            // } else {
            //     console.log('Nope not gonna work');
            //     setIsAdmin(false);
            //     return false;
            // }
            // setUser({name: {firstName: 'Tom', lastName: 'Tapper'}, accessLevel: 'admin'});
            // setIsAdmin(true);

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

    // console.log(user);

    // return { user, isAdmin, login };
    return { user, isAdmin };
};

