import React from 'react';
import { Redirect } from 'react-router-dom';

import pkg from '../../package.json';
import useAuth from '../hooks/useAuth';

import '../sass/Footer.scss';

const Footer = () => {
    const { auth, logout } = useAuth();

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        return <Redirect to='/' />
    };

    return (
        <div className="footer-wrapper">
            <footer className="footer" aria-label="footer">
                <p className="footer-text">v{pkg.version} "Alpha"</p>

                {auth?.user && (
                    <div className="footer-greeting">
                        <p className="footer-text">{`Hi ${auth.user.name.firstName}`}</p>
                        <button className="logout-button" onClick={handleLogout}>{`(LOGOUT)`}</button>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default Footer;