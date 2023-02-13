import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import useAuth from '../hooks/useAuth';
import { authLevelRedirect } from '../utils/authUtils'

import "../sass/Navbar.scss";
//hooks
//function -> class
const Navbar = ({}) => {

  // check user accessLevel and adjust link accordingly
  const [page, setPage] = useState('home');
  const { auth } = useAuth();
  let loginRedirect = '/admin';

  if (auth?.user) {
    loginRedirect = authLevelRedirect(auth.user);
    // admin --> '/admin';
    // user  --> '/projects';
  }

  const LinkWrapper = ({ text, linkedPage, to }) => {
    return (
      <Link
        className={`nav-link-text ${linkedPage === page && "active"}`}
        onClick={e => setPage(linkedPage)}
        to={to}
      >
        {text}
      </Link>
    )
  }

  const NoUserLoggedIn = () => {
    if (!auth?.user) return (
      <>
        <LinkWrapper text="CHECK-IN" linkedPage="home" to="/" />
        <LinkWrapper text="ADMIN" linkedPage="adminLogin" to={loginRedirect} />
      </>
    )
    return (<></>)
  }

  const AdminLoggedIn = () => {
    if (auth?.user?.accessLevel === 'admin') return (
      <>
        <LinkWrapper text={"HOME"} linkedPage="useradmin" to={loginRedirect} />
        <LinkWrapper text={"USERS"} linkedPage="usermanagement" to="/useradmin" />
        <LinkWrapper text={"PROJECTS"} linkedPage="projects" to="/projects" />
      </>
    )
    return (<></>)
  }

  const UserLoggedIn = () => {
    if (auth?.user?.accessLevel === 'user') return (
      <>
        <LinkWrapper text={"PROJECTS"} linkedPage="projects" to="/projects" />
      </>
    )
    return (<></>)
  }

  const NavLinks = () => (
    <div className="navbar-buttons-container">
      <NoUserLoggedIn />
      <AdminLoggedIn />
      <UserLoggedIn />
    </div>
  )

  const Logo = () => (
    <div className="navbar-logo">
      <img src="/hflalogo.png" alt="Hack for LA Logo" />
    </div>
  )

  return (
    <div className="nav-wrapper">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <NavLinks />
        <Logo />
      </nav>
    </div>
  );
};


export default withRouter(Navbar);
