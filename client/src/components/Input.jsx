import React from 'react';
import { useFormContext } from 'react-hook-form';
import { findInputErrors, isFormInvalid } from '../utils/inputValidation'

export const Input = ({label, type, id, placeholder}) => {
    const { 
        register,
        formState: {errors}
     } = useFormContext();
     console.log("STETE", errors)

     const inputError = findInputErrors(errors, label);
     console.log("IE", inputError)
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
                {...register(label, {
                    required: {
                        value: true,
                        message: 'required'
                    }
                })}
            />
        </div>
    )
}

export const InputError = ({ message }) => {
    console.log("ERR", message)
    return <p>{message}</p>
}