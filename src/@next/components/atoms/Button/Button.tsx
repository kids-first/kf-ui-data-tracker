import React from 'react';
import classnames from 'classnames';

export interface IButtonProps {
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    color?:
        | 'gray'
        | 'red'
        | 'yellow'
        | 'green'
        | 'blue'
        | 'indigo'
        | 'purple'
        | 'pink';
    children: React.ReactNode;
}

const base = classnames(
    'inline-flex',
    'items-center',
    'border',
    'border-transparent',
    'font-medium',
    'rounded',
    'shadow-sm',
    'text-white',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
);

const sizes = {
    xsmall: classnames('px-2.5', 'py-1.5', 'text-xs'),
    small: classnames('px-3', 'py-2', 'text-sm', 'leading-4'),
    medium: classnames('px-4', 'py-2', 'text-sm'),
    large: classnames('px-4', 'py-2', 'text-base'),
    xlarge: classnames('px-6', 'py-3', 'text-base'),
};

export const Button = ({color, size = 'medium', children}: IButtonProps) => {
    return (
        <button
            type="button"
            className={classnames(
                base,
                sizes[size],

                `bg-${color}-600`,
                `hover:bg-${color}-700`,
                `focus:ring-${color}-500`,
            )}
        >
            Button text
        </button>
    );
};
