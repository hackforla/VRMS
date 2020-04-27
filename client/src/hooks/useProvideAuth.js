import React, { useState, useEffect } from "react";

import Firebase from "../firebase";
import { set } from "mongoose";

export default function useProvideAuth() {
    const [isAdmin, setIsAdmin] = useState(null);
    const [user, setUser] = useState();

    useEffect(() => {
        if (!user) {
            Firebase.login();
        } else {
        }

        Firebase.auth.onAuthStateChanged((user) => {
            // console.log('Handling auth change with ', user);
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            fetch("/api/checkuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        throw new Error("error with res: " + res.status);
                    }
                })
                .then((res) => {
                    if (res.accessLevel === "admin") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(null);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setIsAdmin(null);
        }
    }, [user]);

    // return { user, isAdmin, login };
    return { user, isAdmin };
}
