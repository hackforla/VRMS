import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import '../sass/CheckIn.scss';

const CheckIn = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    // const [isError, setIsError] = useState(null);
    const [newOrReturning, setNewOrReturning] = useState(props.match.params.userType);
    const [formInput, setFormInput] = useState('');

    async function fetchEvent() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/events?checkInReady=true");
            const resJson = await res.json();

            setEvents(resJson);
            setIsLoading(false);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
            // setIsError(error);
            // alert(error);
        }
    }

    useEffect(() => {
        fetchEvent();

    }, []);

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
                        <form className="form-check-in" onSubmit={e => e.preventDefault()}>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="first-name">First Name</label>
                                    <input 
                                        type="text"
                                        value={formInput.toString()}
                                        aria-label="topic"
                                        onChange={e => setFormInput(e.target.value)}
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="last-name">Last Name</label>
                                    <input 
                                        type="text"
                                        value={formInput.toString()}
                                        aria-label="topic"
                                        onChange={e => setFormInput(e.target.value)}
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="email">Email Address</label>
                                    <input 
                                        type="email"
                                        value={formInput.toString()}
                                        aria-label="topic"
                                        onChange={e => setFormInput(e.target.value)}
                                    /> 
                                </div>
                                <p>{"(This allows easy use of the app. We'll never sell your data!)"}</p>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="current-role">Current Role</label>
                                    <input 
                                        type="text"
                                        value={formInput.toString()}
                                        aria-label="topic"
                                        onChange={e => setFormInput(e.target.value)}
                                    /> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-input-text">
                                    <label htmlFor="desired-role">Desired Role</label>
                                    <input 
                                        type="text"
                                        value={formInput.toString()}
                                        aria-label="topic"
                                        onChange={e => setFormInput(e.target.value)}
                                    /> 
                                </div>
                            </div>
                            {!isLoading ? (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault}>
                                                Check In
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-row">
                                    <div className="form-input-button">
                                        <button type="submit" className="form-check-in-submit" onClick={e => e.preventDefault}>
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

export default CheckIn;
    