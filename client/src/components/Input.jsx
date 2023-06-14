import React from 'react';
import { useFormContext } from 'react-hook-form';

export const Input = ({label, type, id, placeholder}) => {
    const { register } = useFormContext()
    return (
        <div>
            <div>
                <label htmlFor={id}>
                    {label}
                </label>
            </div>
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

export const InputError = () => {
    return <div>Error</div>
}