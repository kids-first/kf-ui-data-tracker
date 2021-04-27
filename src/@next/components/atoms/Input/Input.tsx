import React from 'react';
import classnames from 'classnames';

export interface IInputProps {
    id: string;
    name?: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    help?: string;
}

const baseLabel = classnames(
    'block',
    'text-sm',
    'font-medium',
    'text-gray-700',
);

const baseInput = classnames(
    'shadow-sm',
    'focus:ring-primary-500',
    'focus:border-primary-500',
    'block',
    'w-full',
    'sm:text-sm',
    'border-gray-300',
    'rounded-md',
);

const Input = ({id, name, label, required, placeholder, help}: IInputProps) => {
    return (
        <div>
            <label htmlFor={id} className={baseLabel}>
                {label}
            </label>
            <div className="mt-1">
                <input
                    type="text"
                    name={name}
                    id={id}
                    className={baseInput}
                    placeholder={placeholder}
                />
            </div>
            {help && (
                <p
                    className="mt-2 text-sm text-gray-500"
                    id="email-description"
                >
                    {help}
                </p>
            )}
        </div>
    );
};

export default Input;
