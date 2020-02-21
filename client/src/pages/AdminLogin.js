import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

// import useAuth from '../hooks/useAuth';
// import { authContext } from '../context/authContext';
import Firebase from '../firebase';
import useAuth from '../hooks/useAuth';

import '../sass/AdminLogin.scss';
// import '../sass/HomeContainer-media-queries.scss';



const AdminLogin = (props) => {
    const auth = useAuth();

    // const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    const [isError, setIsError] = useState(false);
    const [email, setEmail] = useState("");
    // const auth = useAuth();

    const handleInputChange = (e) => setEmail(e.currentTarget.value);

    const handleLogin = (e) => {
        e.preventDefault();

        Firebase.submitEmail(email);
        
        // setIsError(false);
        // try {
        //     const isAdmin = await auth.login(email);

        //     if(isAdmin) {
        //         console.log('handleLogin worked!');
        //         props.history.push('/admin');
        //     } else {
        //         setIsError(true);
        //         console.log('Welp that didnt work...');
        //     }
        // } catch(error) {
        //     console.log(error);
        // }
        
    };
    
    useEffect(() => {

    }, []);

    return (
        auth.user 
        ? <Redirect to="/admin" /> 
        : (
            <div className="flex-container">
            <div className="adminlogin-container">
                <div className="adminlogin-headers">
                    <h3>Welcome Back!</h3>
                </div>
                    <form className="form-check-in" autoComplete="off" onSubmit={e => e.preventDefault()}>
                        <div className="form-row">
                            <div className="form-input-text">
                                <label htmlFor="email">Enter your email address:</label>
                                <input 
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={email.toString()}
                                    // aria-label="topic"
                                    onChange={handleInputChange}
                                    aria-label="Email Address"
                                    autoComplete="none"
                                    required
                                /> 
                            </div>
                        </div>
                    </form>
                    <div className="adminlogin-warning">
                        {isError ? `You can try entering your email again, but you might not have access to a dashboard yet` : null}
                    </div>

                    <div className="form-input-button">
                        <button
                            onClick={e => handleLogin(e)}
                            className="login-button"
                        >
                            LOGIN
                        </button>
                    </div>
                    
                </div>
            </div>
        )
    );
};

export default AdminLogin;
    