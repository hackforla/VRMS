import React from "react";
import { AuthProvider } from "./context/authContext";
import { Route } from "react-router-dom";

import Firebase from "./firebase";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import Event from "./pages/Event";
import NewUser from "./pages/NewUser";
import ReturningUser from "./pages/ReturningUser";
import AdminLogin from "./pages/AdminLogin";
import CheckInForm from "./pages/CheckInForm";
import Success from "./pages/Success";
import HandleAuth from "./pages/HandleAuth";
import EmailSent from "./pages/EmailSent";
import Events from "./pages/Events";
import AddNew from './pages/AddNew';
import ProjectLeaderDashboard from "./pages/ProjectLeaderDashboard";

import "./App.scss";

const routes = [
    { path: "/", name: "home", Component: Home },
    { path: "/admin", name: "admindashboard", Component: AdminDashboard },
    { path: "/user", name: "userdashboard", Component: UserDashboard },
    { path: "/profile", name: "profile", Component: UserProfile },
    { path: "/event/:id", name: "event", Component: Event },
    { path: "/new", name: "new", Component: NewUser },
    { path: "/returning", name: "returning", Component: ReturningUser },
    { path: "/login", name: "login", Component: AdminLogin },
    { path: "/checkIn/:userType", name: "checkIn", Component: CheckInForm },
    { path: "/success", name: "success", Component: Success },
    { path: "/handleauth", name: "handleauth", Component: HandleAuth },
    { path: "/emailsent", name: "emailsent", Component: EmailSent },
    { path: "/events", name: "events", Component: Events },
    { path: "/projectleader", name: "pldashboard", Component: ProjectLeaderDashboard },
    { path: '/add/:item', name: 'addnew', Component: AddNew}
];

const App = (props) => {
    return (
        <AuthProvider>
            <div className="app">
                <div className="app-container">
                    <Navbar />
                    <main role="main" className="main">
                        {routes.map(({ path, Component }) => (
                            <Route
                                key={path}
                                exact
                                path={path}
                                component={Component}
                            />
                        ))}
                    </main>
                    <Footer />
                </div>
            </div>
        </AuthProvider>
    );
};

export default App;
