import React from 'react';
import { Link , withRouter } from 'react-router-dom';

import '../sass/Navbar.scss';

const Navbar = (props) => {

    return (
        <div className="nav-wrapper">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    {props.location.pathname === "/" ? (
                        <Link to="/admin">
                            <p className="home-link-text">LOGIN</p>
                        </Link>
                    ) : (
                        <Link to="/">
                            <p className="home-link-text">HOME</p>
                        </Link>
                    )}
                    
                </div>

                {props.location.pathname === "/" || props.location.pathname === "/magicLink" ? (
                    <div className="navbar-image grow">
                        <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
                    </div>
                ) : (
                    <div className="navbar-image">
                        <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default withRouter(Navbar);