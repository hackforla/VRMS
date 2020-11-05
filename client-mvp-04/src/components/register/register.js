import React, { useState, useEffect } from "react";
import Button from '../common/button/button';
import Link from '../../components/common/link/link'
import './register.scss';


const Register = (props) => {

    const [inputtedEmail, setInputtedEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const validateEmail = () => {

        const email_regex = /^\S+@\S+$/;
        const emailIsValid = email_regex.test(inputtedEmail);

        if (emailIsValid) {
            checkUserByEmail();
        } else {
            setErrorMessage(
                <p className="error-msg">
                    *Please enter a valid email address
                </p>
            );
        }

    }

    const checkUserByEmail = async () => {

        console.log('checking user by email');

        try {

            const res = await fetch(`${process.env.REACT_APP_PROXY}/api/checkuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: inputtedEmail }),
            });

            const user = await res.json();
            console.log(user);


            if (user === false) {
                props.history.push('/page');
            } else {
                setErrorMessage(
                    <p className="error-msg">
                        *You already have an account for that email
                        address. Want to <Link
                            path='/page'
                            content='log in'
                            className='error-link'
                            linkKey='dummy'
                        >
                        </Link>
                        ?
                    </p>
                );
            }

        } catch (error) {
            alert(error);
        }

    }

    const handleInputtedEmailChange = async (event) => {
        const inputtedEmail = event.target.value.replace(' ', '');
        setInputtedEmail(inputtedEmail);
    }

    useEffect(() => {
        setErrorMessage(null);
    }, [inputtedEmail])

    return (
        <section data-testid="register" className="register-container">
            <h1 className="register-name">VRMS</h1>
            <h2 className="register-title">Volunteer Relationship Management System</h2>
            <input
                className="email-input-box"
                name="email"
                placeholder="Enter your email"
                value={inputtedEmail}
                onChange={event => handleInputtedEmailChange(event)}
            />
            <Button
                content={`Create Account`}
                className={`register-button`}
                disabled={inputtedEmail.length > 0 ? false : true}
                onClick={validateEmail}
            />

            {errorMessage}
        </ section>
    );
};

export default Register;
