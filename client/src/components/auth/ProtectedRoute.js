import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.user && auth.accessLevel) {
            setLoading(false);
        }
    }, [auth]);

    const meetAccessLevel =
        calculateAccessLevel(auth.accessLevel) >=
        calculateAccessLevel(neededAccessLevel);

    if (loading) {
        return <div className={styles.loader}></div>;
    } else {
        return (
            <Route
                path={path}
                {...rest}
                render={(props) => {
                    return meetAccessLevel ? (
                        <Comp {...props}></Comp>
                    ) : (
                        <Redirect to={redirect}></Redirect>
                    );
                }}
            ></Route>
        );
    }
};

export default ProtectedRoute;
