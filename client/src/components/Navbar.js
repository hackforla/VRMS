import React from "react";
import { Link, withRouter } from "react-router-dom";

import "../sass/Navbar.scss";

const Navbar = (props) => {
    return (
        <div className="nav-wrapper">
            <nav
                className="navbar"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-buttons-container">
                    {props.location.pathname === "/" ? (
                        <Link to="/admin">
                            <p className="home-link-text">LOGIN</p>
                        </Link>
                    ) : (
                        <Link to="/">
                            <p className="home-link-text">HOME</p>
                        </Link>
                    )}

                    {props.location.pathname === "/projectmanager" ? (
                        <Link to="/projects">
                            <p className="home-link-text">PROJECTS</p>
                        </Link>
                    ) : null}

                    {props.location.pathname === "/admin" ? (
                        <>
                            <Link to="/events">
                                <p className="home-link-text">EVENTS</p>
                            </Link>
                            <Link to="/add">
                                <p className="home-link-text">ADD</p>
                            </Link>
                        </>
                    ) : null}
                </div>

                {props.location.pathname === "/" ||
                props.location.pathname === "/success" ? (
                    <div className="navbar-logo grow">
                        <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
                    </div>
                ) : (
                    <div
                        className={`navbar-logo ${
                            props.location.pathname === "/admin" &&
                            "justify-right grow"
                        }`}
                    >
                        <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default withRouter(Navbar);
