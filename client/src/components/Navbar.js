import React from 'react';
import { Link } from 'react-router-dom';

import '../sass/Navbar.scss';

const Navbar = (props) => {
    console.log(props);

    return (
        <div className="nav-wrapper">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    
                    <Link to="/">
                        <p className="home-link-text">Home</p>
                    </Link>
                </div>

                <div className="navbar-image">
                    <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
                </div>

                {/* <div className="navbar-buttons">
                    
                </div> */}
            </nav>
        </div>
    );
};

export default Navbar;