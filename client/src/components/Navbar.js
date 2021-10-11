import React from "react";
import { Link, withRouter } from "react-router-dom";

import useAuth from '../hooks/useAuth';
import {authLevelRedirect} from '../utils/authUtils'

import "../sass/Navbar.scss";

const Navbar = (props) => {

    // check user accessLevel and adjust link accordingly
    const [auth] = useAuth();
    let loginRedirect = '/admin'; 
    if (auth?.user) {
      loginRedirect = authLevelRedirect(auth.user);
      console.log("auth User!: ",auth.user)
    }
    return (
      <div className="nav-wrapper">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-buttons-container">
            {!auth?.user ? (
              <>
                <Link to="/">
                  <p className="home-link-text">HOME</p>
                </Link>
                <Link to={loginRedirect}>
                  <p className="home-link-text">LOGIN</p>
                </Link>
              </>
            ) : null}
            {auth?.user?.accessLevel === 'admin' ? (
              <>
                <Link to="/admin">
                  <p className="home-link-text">HOME</p>
                </Link>
                <Link to="/events">
                  <p className="home-link-text">EVENTS</p>
                </Link>
                <Link to="/useradmin">
                  <p className="home-link-text">ADMIN</p>
                </Link>
                <Link to="/projects">
                  <p className="home-link-text">PROJECTS</p>
                </Link>
              </>
            ) : null}


            {auth?.user?.accessLevel === 'user' ? (
              <Link to="/projects">
                <p className="home-link-text">PROJECTS</p>
              </Link>
            ) : null}
          </div>

          {props.location.pathname === '/' ||
          props.location.pathname === '/success' ? (
            <div className="navbar-logo grow">
              <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
            </div>
          ) : (
            <div
              className={`navbar-logo ${
                props.location.pathname === '/admin' && 'justify-right'
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
