import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

const CheckIn = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    // const [isError, setIsError] = useState(null);
    const [newOrReturning, setNewOrReturning] = useState(props.match.params.userType);
    const [formInput, setFormInput] = useState('');

    // async function fetchEvent() {
    //     try {
    //         setIsLoading(true);
    //         const res = await fetch("http://localhost:4000/api/events?checkInReady=true");
    //         const resJson = await res.json();

    //         setEvents(resJson);
    //         setIsLoading(false);
    //     } catch(error) {
    //         console.log(error);
    //         setIsLoading(false);
    //         // setIsError(error);
    //         // alert(error);
    //     }
    // }

    // useEffect(() => {
    //     fetchEvent();

    // }, []);

    return (
        <div className="flexcenter-container">
            {newOrReturning === 'returningUser' ? (
                <div className="check-in-container">
                    <div className="check-in-headers">
                        <h3>Welcome Back!</h3>
                        <h4>Answer a quick question to unlock the check-in button!</h4>
                    </div>
                    <div className="check-in-form">
                        <form className="form-topics" onSubmit={e => e.preventDefault()}>
                            <div className="form-input-text">
                                <input 
                                    placeholder="Returning User Form"
                                    type="text"
                                    value={formInput.toString()}
                                    aria-label="topic"
                                    onChange={e => setFormInput(e.target.value)}
                                /> 
                            </div>
                            <div className="form-input-button">
                                <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault}>
                                        Check In
                                </button>
                            </div>
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
                        <form className="form-topics" onSubmit={e => e.preventDefault()}>
                            <div className="form-input-text">
                                <input 
                                    placeholder="New User Form"
                                    type="text"
                                    value={formInput.toString()}
                                    aria-label="topic"
                                    onChange={e => setFormInput(e.target.value)}
                                /> 
                            </div>
                            <div className="form-input-button">
                                <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault}>
                                        Check In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    )
};

export default CheckIn;
    