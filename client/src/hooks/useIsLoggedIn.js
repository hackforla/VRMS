import { useState, useEffect } from 'react';

export default function useIsLoggedIn(userId){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    console.log(`UserId: ${userId}`);

    // The login you want to reuse.
    const handleIsLoggedInChange = (id) => {
        console.log(`Id: ${id}`);
        console.log(`isLoggedIn: ${isLoggedIn}`);

        if(id === 1) {
            console.log(`It's true!!!`);
            setIsLoggedIn(true);
            console.log(`isLoggedIn after setIsLoggedIn: ${isLoggedIn}`);

        } else {
            console.log(`It's false!!!`);
            setIsLoggedIn(false);
        }
    }

    // Perform side effects in useEffect.
    useEffect(() => {
        handleIsLoggedInChange(userId);
        console.log(`isLoggedIn in custom hook useEffect: ${isLoggedIn}`);

    })

    return [ isLoggedIn ];
}