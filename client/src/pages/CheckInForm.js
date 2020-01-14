import React, { useState, useEffect } from 'react';

import '../sass/CheckIn.scss';

const CheckInForm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    // const [isFormReady, setIsFormReady] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
    const [month, setMonth] = useState("JAN");
    const [year, setYear] = useState("2020");

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

    const handleMonthChange = (e) => setMonth(
        e.currentTarget.value
    );

    const handleYearChange = (e) => setYear(
        e.currentTarget.value
    );

    const handleNewMemberChange = (e) => {
        if (e.target.value === "true") {
            setNewMember(true);
            setMonth("JAN");
            setYear("2020");
        }

        if (e.target.value === "false") {
            setNewMember(false);
        }
    };

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const years = ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013"];
    
    const submitForm = (userForm) => {
        // First, create a new user in the user collection
        console.log(userForm);

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
                // Then, create a new check-in

                const checkInForm = { userId: (responseId), eventId: new URLSearchParams(props.location.search).get('eventId') };

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

    // function checkIsEmptyField(obj) {
    //     if (!Object.values(obj).some(key => (key !== null && key !== ''))) {
    //         setIsError(true);
    //         setErrorMessage("Please don't leave any fields blank");
    //         setIsFormReady(false);
    //     }  
    // } 

    const checkInNewUser = (e) => {
        e.preventDefault();

        const firstAttended = `${month} ${year}`;
            
        // SET all of the user's info from useState objects
        const userForm = { 
            name: { 
                firstName, 
                lastName 
            }, 
            ...formInput,
            newMember,
            firstAttended
        };

        let ready = true;

        try {
            setIsLoading(true);

            if (
                userForm.name.firstName === "" || 
                userForm.name.lastName === "" || 
                userForm.email === "" || 
                userForm.currentRole === "" || 
                userForm.desiredRole === "" || 
                firstAttended === ""
            ) {
                setIsError(true);
                setErrorMessage("Please don't leave any fields blank");
                ready = false;
            } 

            if(year === "2020" && month !== "JAN") {
                setIsError(true);
                setErrorMessage("You can't set a date in the future... Please try again.");
                ready = false;
            } 

            // console.log(isFormReady);

            // SUBMIT all of the user's info from the userForm object
            if(ready) {
                submitForm(userForm);
            }  

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
                        <h4>Tell us a little bit about yourself:</h4>
                    </div>
                    <div className="check-in-form">
                        <form className="form-check-in" autoComplete="off" onSubmit={e => e.preventDefault()}>
                            <div className="form-row">
                                <div className="form-input-text">
                                    {/* <label htmlFor="first-name">First Name</label> */}
                                    <input 
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={firstName.toString()}
                                        // aria-label="topic"
                                        onChange={handleFirstNameChange}
                                        aria-label="First Name"
                                        required
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    {/* <label htmlFor="last-name">Last Name</label> */}
                                    <input 
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={lastName.toString()}
                                        // aria-label="topic"
                                        onChange={handleLastNameChange}
                                        aria-label="Last Name"
                                        required
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    {/* <label htmlFor="email">Email Address</label> */}
                                    <input 
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formInput.email.toString()}
                                        // aria-label="topic"
                                        onChange={handleInputChange}
                                        aria-label="Email Address"
                                        required
                                    /> 
                                </div>
                                <p>{"(This allows easy use of the app. We'll never sell your data!)"}</p>
                            </div>

                            {questions.length !== 0 && questions.map((question) => {
                                return question.type === 'text' && (
                                    <div key={question._id} className="form-row">
                                        <div className="form-input-text">
                                            {/* <label htmlFor={question.htmlName}>{question.questionText}</label> */}
                                            <input 
                                                type="text"
                                                name={question.htmlName}
                                                placeholder={question.placeholderText}
                                                value={Object.keys(formInput).includes(question.htmlName) ? formInput[question.htmlName.toString()].toString() : ""}
                                                // aria-label="topic"
                                                onChange={handleInputChange}
                                                required
                                            /> 
                                        </div>
                                    </div>
                                );
                            })}

                            {questions.length !== 0 && questions.map((question) => {
                                return question.type === 'select' && (
                                    <div key={question._id} className="form-row">
                                        <div className="form-input-radio">
                                            <label htmlFor={question.htmlName}>Is this your first time attending a Hack Night?</label>
                                            <div className="radio-buttons">
                                                <input 
                                                    id="radio1"
                                                    type="radio"
                                                    name={question.htmlName}
                                                    value={true}
                                                    // aria-label="topic"
                                                    onChange={handleNewMemberChange}
                                                    defaultChecked
                                                    required
                                                /> 
                                                <label htmlFor="radio1">Yes</label>
                                                <input 
                                                    id="radio2"
                                                    type="radio"
                                                    name={question.htmlName}
                                                    value={false}
                                                    // aria-label="topic"
                                                    onChange={handleNewMemberChange}
                                                /> 
                                                <label htmlFor="radio2">No</label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {newMember === true ? (null) : (
                                questions.length !== 0 && questions.map((question) => {
                                    return question.htmlName === 'attendanceLength' && (
                                        <div key={question._id} className="form-row">
                                            <div className="form-input-text">
                                                <label htmlFor={question.htmlName}>{question.questionText}</label>
                                                <div className="radio-buttons">
                                                    <select 
                                                        name={question.htmlName}
                                                        value={month}
                                                        // aria-label="topic"
                                                        onChange={handleMonthChange}
                                                        required
                                                    >
                                                    {months.map((month, index) => {
                                                        return <option key={index} value={month}>{month}</option>
                                                    })} 
                                                    </select>
                                                    <select 
                                                        name={question.htmlName}
                                                        value={year}
                                                        // aria-label="topic"
                                                        onChange={handleYearChange}
                                                        required
                                                    >
                                                    {years.map((year, index) => {
                                                        return <option key={index} value={year}>{year}</option>
                                                    })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {isError && errorMessage.length > 1 ? <div className="error">{errorMessage}</div> : null}

                            {!isLoading ? (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => checkInNewUser(e)}>
                                                CHECK IN
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault()}>
                                                CHECKING IN...
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
