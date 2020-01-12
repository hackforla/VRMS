import React, { useState, useEffect } from 'react';

import '../sass/CheckIn.scss';

const CheckInForm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [newOrReturning] = useState(props && props.match.params.userType);
    const [formInput, setFormInput] = useState({ 
        email: "",
        currentRole: "",
        desiredRole: "",
        attendanceLength: ""
    });

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newMember, setNewMember] = useState(true);

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
        }
    }

    const handleInputChange = (e) => setFormInput({
        ...formInput,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const handleFirstNameChange = (e) => setFirstName(
        e.currentTarget.value
    );

    const handleLastNameChange = (e) => setLastName(
        e.currentTarget.value
    );

    const handleNewMemberChange = (e) => {
        setNewMember(e.target.value);
        console.log(newMember);
    };
    
    const submitForm = (userForm) => {
        // First, create a new user in the user collection
        fetch('/api/users', {
            method: "POST",
            body: JSON.stringify(userForm),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error(res.statusText);
            })
            .then(responseId => {

                const checkInForm = { userId: (responseId), eventId: new URLSearchParams(props.location.search).get('eventId') };
                // console.log(checkInForm);
                // Then, create a new check-in
                return fetch('/api/checkins', {
                    method: "POST",
                    body: JSON.stringify(checkInForm),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    props.history.push('/magicLink');
                })
                .catch(err => console.log(err));
            })
            .catch(err => {
                console.log(err);
            });
    }

    const checkInNewUser = (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            
            // Set the user's info from useState object
            const userForm = { 
                name: { 
                    firstName, 
                    lastName 
                }, 
                ...formInput,
                newMember
            };

            submitForm(userForm);
            setIsLoading(false);

        } catch(error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const checkInReturningUser = (e) => {
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

    // function getFormValue() {
    //     if (Object.keys(formInput).includes(questions[0].htmlName.toString())) {
    //         return `{formInput.${questions[0].htmlName.toString()}.toString()}`
    //     } 
    // }

    useEffect(() => {
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
                                    value={formInput.attendance}
                                    // aria-label="topic"
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
                                        value={firstName.toString()}
                                        // aria-label="topic"
                                        onChange={handleFirstNameChange}
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="last-name">Last Name</label>
                                    <input 
                                        type="text"
                                        name="lastName"
                                        value={lastName.toString()}
                                        // aria-label="topic"
                                        onChange={handleLastNameChange}
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
                                        // aria-label="topic"
                                        onChange={handleInputChange}
                                    /> 
                                </div>
                                <p>{"(This allows easy use of the app. We'll never sell your data!)"}</p>
                            </div>

                            {questions.length !== 0 && questions.map((question) => {
                                return question.type === 'text' && (
                                    <div key={question._id} className="form-row">
                                        <div className="form-input-text">
                                            <label htmlFor={question.htmlName}>{question.questionText}</label>
                                            <input 
                                                type="text"
                                                name={question.htmlName}
                                                value={Object.keys(formInput).includes(question.htmlName) ? formInput[question.htmlName.toString()].toString() : ""}
                                                // aria-label="topic"
                                                onChange={handleInputChange}
                                            /> 
                                        </div>
                                    </div>
                                );
                            })}

                            {questions.length !== 0 && questions.map((question) => {
                                return question.type === 'select' && (
                                    <div key={question._id} className="form-row">
                                        <div className="form-input-text">
                                            <label htmlFor={question.htmlName}>{question.questionText}</label>
                                            <select 
                                                name={question.htmlName}
                                                value={newMember}
                                                // aria-label="topic"
                                                onChange={handleNewMemberChange}
                                                required
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* {newMember === false ? (
                                questions.length !== 0 && questions.map((question) => {
                                    return question.htmlName === 'attendanceLength' && (
                                        <div key={question._id} className="form-row">
                                            <div className="form-input-text">
                                                <label htmlFor={question.htmlName}>{question.questionText}</label>
                                                <input 
                                                    type="text"
                                                    name={question.htmlName}
                                                    value={Object.keys(formInput).includes(question.htmlName) ? formInput[question.htmlName.toString()].toString() : ""}
                                                    // aria-label="topic"
                                                    onChange={handleInputChange}
                                                /> 
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (null)
                            } */}

                            {newMember === true ? (null) : (
                                questions.length !== 0 && questions.map((question) => {
                                    return question.htmlName === 'attendanceLength' && (
                                        <div key={question._id} className="form-row">
                                            <div className="form-input-text">
                                                <label htmlFor={question.htmlName}>{question.questionText}</label>
                                                <input 
                                                    type="text"
                                                    name={question.htmlName}
                                                    value={Object.keys(formInput).includes(question.htmlName) ? formInput[question.htmlName.toString()].toString() : ""}
                                                    // aria-label="topic"
                                                    onChange={handleInputChange}
                                                /> 
                                            </div>
                                        </div>
                                    );
                                })
                            )}

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
    