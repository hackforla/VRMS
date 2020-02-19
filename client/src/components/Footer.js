import React from 'react';

import '../sass/Footer.scss';

import useAuth from '../hooks/useAuth';

const Footer = () => {
    const auth = useAuth();
    console.log(auth);

    return (
        <div className="footer-wrapper">
            <footer className="footer" aria-label="footer">
                <p className="footer-text">version: 0.1</p>

                {auth.user ? (
                    <p className="footer-text footer-greeting">Logged in as {auth.user.name.firstName}</p>
                ) : (
                    null
                )}
            </footer>
        </div>
    );
};

export default Footer;