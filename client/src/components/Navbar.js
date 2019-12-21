import React from 'react';
import { Link } from 'react-router-dom';

import '../sass/Navbar.scss';

const Navbar = (props) => {

    return (
        <div className="nav-wrapper">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link to="/">
                        Home
                    </Link>
                </div>

                <div className="navbar-buttons">
                    <Link className="navbar-button primary" to="/new">New User</Link>
                    <Link className="navbar-button" to="/returning">Returning User</Link>
                    <Link className="navbar-button primary" to="/dashboard">Dashboard</Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;