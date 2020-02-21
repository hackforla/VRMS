import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

import '../sass/MagicLink.scss';

const EmailSent = (props) => {

    useEffect(() => {
        // fetchData();
        let timer = setTimeout(() => {
            props.history.push('/');
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex-container">
            <div className="new">
                <div className="new-headers">
                    <h3>Success!</h3>
                    <p>Please check your email for a link to login and see your dashboard.</p>
                </div>
            </div>
        </div>
    )
};

export default EmailSent; 