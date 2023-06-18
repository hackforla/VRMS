import React from 'react';
import { useFormContext } from 'react-hook-form';
import { findInputErrors, isFormInvalid } from '../utils/inputValidation'
import "../sass/Form.scss";

export const Input = ({ label, type, id, placeholder, validation, name, multiline }) => {
    const { 
        register,
        formState: {errors}
     } = useFormContext();

     const inputError = findInputErrors(errors, label);
     const isInvalid = isFormInvalid(inputError);

    return (
        <div>
            <div>
                <label className="input-label" htmlFor={id}>
                    {label}
                </label>
            </div>
           
          
        {
            multiline ? (
                <div>
                    <textarea 
                        className="new-project-input project-textarea"
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        {...register(`${name}`, validation)}
                    />
                    {isInvalid && (
                            <InputError 
                            message={inputError.error.message}
                            key={inputError.error.message} 
                            />
                        )}
                </div>
                ) : (
                    <div>
                        <input
                            id={id}
                            className="new-project-input"
                            type={type}
                            placeholder={placeholder}
                            {...register(name, validation)}
                        />
                        {isInvalid && (
                            <InputError 
                                message={inputError.error.message}
                                key={inputError.error.message} 
                            />
                        )}
                    </div>
                        )
                    }
            </div>
    )
}

export const InputError = ({ message }) => {
    return <p className="form-error">{message}</p>
}