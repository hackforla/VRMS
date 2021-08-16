import React from 'react';
import { Email } from './validation';

describe('Email', () => {
  test('Should be invalid after check using RegExp', () => {
    let isEmailValid = false;
    expect(isEmailValid).toBeFalsy();

    isEmailValid = Email.isValid('test');
    expect(isEmailValid).toBeFalsy();

    isEmailValid = Email.isValid('test@gmail');
    expect(isEmailValid).toBeFalsy();

    isEmailValid = Email.isValid('test@gmail.c');
    expect(isEmailValid).toBeFalsy();
  });

  test('Should be valid after check using RegExp', () => {
    let isEmailValid = false;
    expect(isEmailValid).toBeFalsy();

    isEmailValid = Email.isValid('test@gmail.co');
    expect(isEmailValid).toBeTruthy();

    isEmailValid = Email.isValid('test@gmail.com');
    expect(isEmailValid).toBeTruthy();

    isEmailValid = Email.isValid('test.test@gmail.com');
    expect(isEmailValid).toBeTruthy();

    isEmailValid = Email.isValid('test55@gmail.com');
    expect(isEmailValid).toBeTruthy();
  });
});
