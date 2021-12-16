import React, {useState} from "react";
import { Link, withRouter } from "react-router-dom";

import useAuth from '../hooks/useAuth';
import {authLevelRedirect} from '../utils/authUtils'

import "../sass/Navbar.scss";
//hooks
//function -> class
const Navbar = (props) => {

    // check user accessLevel and adjust link accordingly
    const [page, setPage] = useState('home');
    const { auth } = useAuth();
    let loginRedirect = '/admin';
    if (auth?.user) {
      loginRedirect = authLevelRedirect(auth.user);
    }
    const notAuth = () => (
        <>
          {page === 'home' ?
            <p className="nav-link-text nav-link-active">CHECK-IN</p>
            :
            <div className='nav-link-container'>
              <Link to="/" onClick={e => setPage('home')} >
                <p className="nav-link-text">
                  CHECK-IN
                </p>
              </Link>
            </div>}
          {page === 'adminLogin' ?
            <p className="nav-link-text nav-link-active">ADMIN</p>
            :
            <div className='nav-link-container'>
              <Link to={loginRedirect} onClick={e => setPage('adminLogin')}>
                <p className="nav-link-text">
                  ADMIN
                </p>
              </Link>
            </div>
            }
        </>
    )
    const isAuth = () => (
      <>
        {page === 'home' ?
          <p className="nav-link-text nav-link-active" >HOME</p>
          :
          <div className='nav-link-container'>
            <Link to="/admin" onClick={e => setPage('home')} className="nav-link-text">
              <p className="nav-link-text">HOME</p>
            </Link>
          </div>}
        {page === 'events' ?
          <p className="nav-link-text nav-link-active" >EVENTS</p>
          :
          <div className='nav-link-container'>
            <Link to="/events" onClick={e => setPage('events')}>
              <p className="nav-link-text">EVENTS</p>
            </Link>
          </div>}
        {page === 'useradmin' ?
          <p className="nav-link-text nav-link-active" >ADMIN</p>
          :
          <div className='nav-link-container'>
            <Link to="/useradmin" onClick={e => setPage('useradmin')}>
              <p className="nav-link-text">ADMIN</p>
            </Link>
          </div>}
        {page === 'projects' ?
          <p className="nav-link-text nav-link-active" >PROJECTS</p>
          :
          <div className='nav-link-container'>
            <Link to="/projects" onClick={e => setPage('projects')}>
              <p className="nav-link-text">PROJECTS</p>
            </Link>
          </div>}
      </>
    )
    const isUser = () => (
      <>
        {page === 'home' ?
          <p className="nav-link-text nav-link-active" >PROJECTS</p>
          :
          <div className='nav-link-container'>
            <Link to="/projects" onClick={e => setPage('home')}>
              <p className="nav-link-text">PROJECTS</p>
            </Link>
          </div>}
      </>
    )


    return (
      <div className="nav-wrapper">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-buttons-container">

            {!auth?.user ? (
              notAuth()
            ) : null}

            {auth?.user?.accessLevel === 'admin' ? (
              isAuth()
            ) : null}

            {auth?.user?.accessLevel === 'user' ? (
              isUser()
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
