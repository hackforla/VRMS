import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { securedFetch } from '../../utils/securedFetch';

import { useUserContext } from "../auth";
import Button from '../common/button/button';
import Input from '../common/input/input';
import "./SignUp.scss";

/* Demonstration sign up form.  To be replaced with multi-step form matching project specifications.
 */
const SignUpForm = () => {
  const [awsUser, appUser, , refreshUserInfo] = useUserContext();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const onFirstNameChange = (e) => {
    setFirstName(e.currentTarget.value);
  }
  const onLastNameChange = (e) => {
    setLastName(e.currentTarget.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      awsUserId: awsUser.attributes.sub,
      signupEmail: awsUser.attributes.email,
      firstName,
      lastName
    }

    securedFetch("/api/users/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    })
      .then(refreshUserInfo());
  }

  if(awsUser && appUser) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <section>
      <h1 className="title-short">VRMS</h1>
      <form className="sign-up-form" onSubmit={onSubmit}>
        <Input
          name="email"
          value={awsUser.attributes.email}
          type={'email'}
          readOnly
        />

        <Input
          name="firstName"
          placeholder="First Name"
          type={'string'}
          onChange={onFirstNameChange}
        />

        <Input
          name="lastName"
          placeholder="Last Name"
          type={'string'}
          onChange={onLastNameChange}
        />

        <Button
          type={'submit'}
          content={`Create Account`}
          className={'create-account-button'}
        />
      </form>
    </section>
  );
};

export default SignUpForm;
