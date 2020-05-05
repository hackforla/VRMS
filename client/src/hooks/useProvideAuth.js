import React, { useState, useEffect } from "react";

import Firebase from "../firebase";
import ls from "local-storage";
import { set } from "mongoose";

export default function useProvideAuth() {
    const [accessLevel, setAccessLevel] = useState(null);
    const [user, setUser] = useState();

    useEffect(() => {
        if (!user) {
            Firebase.login();
        }

        Firebase.auth.onAuthStateChanged((user) => {
            // console.log('Handling auth change with ', user);
            if (user) {
                setUser(user);
                ls.set("expectedSignIn", "1");
            } else {
                setUser(null);
                ls.remove("expectedSignIn");
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
                    setAccessLevel(res.accessLevel);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [user]);

    // return { user, isAdmin, login };
    return { user, accessLevel };
}
