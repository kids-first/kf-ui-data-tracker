import React from 'react';
import classnames from 'classnames';
import {RefreshIcon} from '@heroicons/react/solid';

export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export interface IButtonProps {
    size?: ButtonSize;
    color?:
        | 'primary'
        | 'gray'
        | 'red'
        | 'yellow'
        | 'green'
        | 'blue'
        | 'indigo'
        | 'purple'
        | 'pink';
    onClick?: () => any;
    loading?: boolean;
    disabled?: boolean;
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

const sizes: {[key in ButtonSize]: string} = {
    xsmall: classnames('px-2.5', 'py-1.5', 'text-xs'),
    small: classnames('px-3', 'py-2', 'text-sm', 'leading-4'),
    medium: classnames('px-4', 'py-2', 'text-sm'),
    large: classnames('px-4', 'py-2', 'text-base'),
    xlarge: classnames('px-6', 'py-3', 'text-base'),
};

const iconSizes: {[key in ButtonSize]: string} = {
    xsmall: classnames('-ml-0.5', 'mr-2', 'h-4', 'w-4'),
    small: classnames('-ml-1', 'mr-2', 'h-5', 'w-5'),
    medium: classnames('-ml-1', 'mr-3', 'h-5', 'w-5'),
    large: classnames('-ml-1', 'mr-3', 'h-5', 'w-5'),
    xlarge: classnames('-ml-1', 'mr-3', 'h-5', 'w-5'),
};

export const Button = ({
    color = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    onClick,
    children,
}: IButtonProps) => {
    return (
        <button
            type="button"
            className={classnames(
                base,
                sizes[size],
                disabled
                    ? ['bg-gray-100', 'text-gray-600', 'cursor-default']
                    : [],
                !disabled
                    ? [
                          `bg-${color}-600`,
                          `hover:bg-${color}-700`,
                          `focus:ring-${color}-500`,
                      ]
                    : [],
                {'animate-pulse': loading},
            )}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
        >
            {loading && (
                <RefreshIcon
                    className={classnames('animate-spin', iconSizes[size])}
                />
            )}
            {children}
        </button>
    );
};
