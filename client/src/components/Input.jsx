import React from 'react';
import { useFormContext } from 'react-hook-form';
import { findInputErrors, isFormInvalid } from '../utils/inputValidation'

export const Input = ({ label, type, id, placeholder, validation, name }) => {
    const { 
        register,
        formState: {errors}
     } = useFormContext();

     const inputError = findInputErrors(errors, label);
     const isInvalid = isFormInvalid(inputError);

    return (
        <div>
            <div>
                <label htmlFor={id}>
                    {label}
                </label>
            </div>
            {isInvalid && (
                <InputError 
                    message={inputError.error.message}
                    key={inputError.error.message} 
                />
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register(name, validation)}
            />
        </div>
    )
}

export const InputError = ({ message }) => {
    console.log("ERR", message)
    return <p>{message}</p>
}