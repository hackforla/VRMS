import React from "react";
import app from "firebase/app";
import "firebase/auth";

import { Redirect } from "react-router-dom";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase class with async methods
class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        // console.log('Firebase initialized');

        this.auth = app.auth();
        // console.log('Auth initialized');
    }

    isInitialized() {
        return new Promise((resolve) => {
            this.auth.onAuthStateChanged(resolve);
        });
    }

    async submitEmail(email) {
        // console.log('Try submitting ' + email + '...');

        try {
            const actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be whitelisted in the Firebase Console.
                url: process.env.REACT_APP_FIREBASE_DEV_REDIRECT_URL,
                // This must be true.
                handleCodeInApp: true,
            };

            await this.auth
                .sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem("emailForSignIn", email);

                    return true;
                })
                .catch((error) => {
                    // Some error occurred, you can inspect the code: error.code
                    console.log(error);

                    return false;
                });
        } catch (error) {
            console.log(error);

            return false;
        }
    }

    async login() {
        // console.log('Trying to login');
        // Confirm the link is a sign-in with email link.
        try {
            if (this.auth.isSignInWithEmailLink(window.location.href)) {
                // Additional state parameters can also be passed via URL.
                // This can be used to continue the user's intended action before triggering
                // the sign-in operation.
                // Get the email if available. This should be available if the user completes
                // the flow on the same device where they started it.
                let email = window.localStorage.getItem("emailForSignIn");
                console.log("From local storage: " + email);

                if (!email) {
                    // User opened the link on a different device. To prevent session fixation
                    // attacks, ask the user to provide the associated email again. For example:
                    email = window.prompt(
                        "Please provide your email for confirmation:"
                    );
                }
                // The client SDK will parse the code from the link for you.
                const result = await this.auth.signInWithEmailLink(
                    email,
                    window.location.href
                );

                // window.localStorage.removeItem('emailForSignIn', email);

                console.log("Login potentially successful?");
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }

    logout() {
        return this.auth.signOut();
    }

    // getCurrentUsername() {
    //     return this.auth.currentUser && this.auth.currentUser.displayName;
    // };
}

export default new Firebase();
