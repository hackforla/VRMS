import React from 'react';

import pkg from '../../package.json';
import useAuth from '../hooks/useAuth';

import '../sass/Footer.scss';

const Footer = () => {
    const [auth] = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        // TODO: re-implement logout without firebase


    };

    return (
        <div className="footer-wrapper">
            <footer className="footer" aria-label="footer">
                <p className="footer-text">v{pkg.version} "Alpha"</p>

                {auth?.user ? (
                    <div className="footer-greeting">
                        <p className="footer-text">{`Hi ${auth.user.name.firstName}`}</p>
                        <button className="logout-button" onClick={handleLogout}>{`(LOGOUT)`}</button>
                    </div>
                ) : (
                    null
                )}
            </footer>
        </div>
    );
};

export default Footer;