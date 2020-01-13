import React from 'react';
import { Link } from 'react-router-dom';

import '../sass/Navbar.scss';

const Navbar = (props) => {
    console.log(props.match);

    return (
        <div className="nav-wrapper">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link to="/">
                        <p className="home-link-text">VRMS+</p>
                        <p className="home-link-text">HFLA</p>
                    </Link>
                </div>

                <div className="navbar-buttons">
                    {/* <Link className="navbar-button primary" to="/new">New User</Link>
                    <Link className="navbar-button" to="/returning">Returning User</Link>
                    <Link className="navbar-button primary" to="/admin">Dashboard</Link> */}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;