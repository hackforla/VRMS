import React from 'react';
import { Auth } from 'aws-amplify';
import { Hub } from "@aws-amplify/core";

export const SignOutButton = ({text = "Sign Out", ...rest}) => {
  const signOut = async () => {
    await Auth.signOut();
    // The signOut() method doesn't issue a sign out event, so we have to do it ourselves.
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: "signedout",
    });
  }
  return (
    <button type="button" onClick={signOut} {...rest}>{text}</button>
)};