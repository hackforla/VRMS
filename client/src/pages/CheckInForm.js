import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import '../sass/CheckIn.scss';

const CheckInForm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [questions, setQuestions] = useState([]);
    // const [isError, setIsError] = useState(null);
    const [newOrReturning, setNewOrReturning] = useState(props && props.match.params.userType);
    const [formInput, setFormInput] = useState({ 
        firstName: "",
        lastName: "",
        email: "",
        currentRole: "",
        desiredRole: "",
        answer: ""
    });

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/questions");
            const resJson = await res.json();

            setQuestions(resJson);

            console.log(questions);
            setIsLoading(false);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
            // setIsError(error);
            // alert(error);
        }
    }

    const handleInputChange = (e) => setFormInput({
        ...formInput,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const submitForm = (userForm) => {
        const formToSubmit = JSON.stringify(userForm);

        // Remove empty values, then submit form to db ? 
        
        // fetch('/api/users', {
        //     method: "POST",
        //     body: JSON.stringify(formToSubmit),
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        //     .then(res => {
        //         if (res.ok) {
        //             return res.ok;
        //         }
        //         throw new Error(res.statusText);
        //     })
        //     .catch(err => {
        //         console.log(error);
        //     });
        
        console.log(formToSubmit);
        console.log('Submitting form!');
    }

    const checkInNewUser = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            // First, create a new user in the user collection
            // return userId for next step
            // const res = await fetch("/api/checkIn", { method: 'POST' });


            // Second, create new checkIn using userId
            // const res = await fetch("/api/checkIn", { method: 'POST' });
            // const resJson = await res.json();
            
            // setResponse ? 

            submitForm(formInput);

            console.log('Checking in New User');

            setIsLoading(false);

            props.history.push('/magicLink');

        } catch(error) {
            console.log(error);
            setIsLoading(false);
            // setIsError(error);
            // alert(error);
        }
    }

    const checkInReturningUser = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            // Get userId from auth cookie (JWT) => return it in response
            // fetch to create checkin using userId

            // const res = await fetch("/api/checkIn", { method: 'POST' });
            // const resJson = await res.json();
            // 
            // setResponse ? 

            submitForm(formInput);

            console.log('Checking in Returning User');

            setIsLoading(false);
            
            // Redirect 
            props.history.push('/user');

        } catch(error) {
            console.log(error);
            setIsLoading(false);
            // setIsError(error);
            // alert(error);
        }
    }

    useEffect(() => {
        // fetchEvent();
        fetchQuestions();

    }, []);

    return (
        <div className="flex-container">
            {newOrReturning === 'returningUser' ? (
                <div className="check-in-container">
                    <div className="check-in-headers">
                        <h3>Welcome Back!</h3>
                        <h4>Answer a quick question to unlock the check-in button!</h4>
                    </div>
                    <div className="check-in-form">
                        <form className="form-returning" onSubmit={e => e.preventDefault()}>
                            <div className="form-input-text">
                                <input 
                                    placeholder=""
                                    type="text"
                                    name="answer"
                                    value={formInput.answer}
                                    aria-label="topic"
                                    onChange={handleInputChange}
                                /> 
                            </div>
                            {!isLoading ? (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => checkInReturningUser(e)}>
                                                Check In
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault()}>
                                                Checking In...
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            ) : null}

            {newOrReturning === 'newUser' ? (
                <div className="check-in-container">
                    <div className="check-in-headers">
                        <h3>Welcome!</h3>
                        <h4>Tell us a little bit about yourself!</h4>
                    </div>
                    <div className="check-in-form">
                        <form className="form-check-in" onSubmit={e => e.preventDefault()}>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="first-name">First Name</label>
                                    <input 
                                        type="text"
                                        name="firstName"
                                        value={formInput.firstName.toString()}
                                        aria-label="topic"
                                        onChange={handleInputChange}
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="last-name">Last Name</label>
                                    <input 
                                        type="text"
                                        name="lastName"
                                        value={formInput.lastName.toString()}
                                        aria-label="topic"
                                        onChange={handleInputChange}
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="email">Email Address</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={formInput.email.toString()}
                                        aria-label="topic"
                                        onChange={handleInputChange}
                                    /> 
                                </div>
                                <p>{"(This allows easy use of the app. We'll never sell your data!)"}</p>
                            </div>

                            {console.log(questions)}

                            {questions.length !== 0 && questions.map((question, index) => {
                                return (
                                    <div key={index} className="form-row">
                                        <div className="form-input-text">
                                            <label htmlFor="current-role">{question.questionText}</label>
                                            <input 
                                                type="text"
                                                name="currentRole"
                                                value={formInput.currentRole.toString()}
                                                aria-label="topic"
                                                onChange={handleInputChange}
                                            /> 
                                        </div>
                                    </div>
                                );
                            })}

                            {!isLoading ? (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => checkInNewUser(e)}>
                                                Check In
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault()}>
                                                Checking In...
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    )
};

export default CheckInForm;
    