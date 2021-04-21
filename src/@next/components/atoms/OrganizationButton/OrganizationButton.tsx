import React from 'react';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

export interface IOrganizationButtonProps {
    children: React.ReactNode;
    current?: boolean;
    icon?: React.ElementType;
}

const base = classnames(
    'text-gray-600',
    'hover:bg-gray-200',
    'hover:text-gray-800',
    'group',
    'flex',
    'items-center',
    'px-2',
    'py-2',
    'text-sm',
    'font-medium',
);

export const OrganizationButton = ({
    children,
    current,
    icon: Icon,
}: IOrganizationButtonProps) => {
    return (
        <Link
            to="/"
            className={classnames(base, {
                'bg-gray-300': current,
                'text-gray-900': current,
            })}
        >
            {Icon && (
                <Icon
                    className={classnames(
                        'group-hover:text-gray-700',
                        'mr-3',
                        'h-6',
                        'w-6',
                        {'text-gray-600': !current},
                        {'text-gray-700': current},
                    )}
                />
            )}
            {children}
        </Link>
    );
};
