import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import ls from "local-storage";
import { Route, Redirect } from "react-router-dom";
import styles from "../../sass/Loader.module.scss";

const calculateAccessLevel = (accessLevel) => {
    switch (accessLevel) {
        case "admin":
            return 300;
        case "projectleader":
            return 200;
        case "user":
            return 100;
        default:
            return 0;
    }
};

const ProtectedRoute = ({
    component: Comp,
    path,
    neededAccessLevel,
    redirect,
    ...rest
}) => {
    const auth = useContext(AuthContext);

    const meetAccessLevel =
        calculateAccessLevel(auth.accessLevel) >=
        calculateAccessLevel(neededAccessLevel);

    if (auth.user && auth.accessLevel) {
        if (meetAccessLevel) {
            return <Route path={path} component={Comp} {...rest}></Route>;
        } else {
            return <Redirect to={redirect}></Redirect>;
        }
    } else if (ls.get("expectedSignIn")) {
        return <div className={styles.loader}></div>;
    } else {
        return <Redirect to={redirect}></Redirect>;
    }
};

export default ProtectedRoute;
