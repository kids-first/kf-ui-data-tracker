import React from 'react';
import classnames from 'classnames';

export interface ISidebarButtonProps {
    children: React.ReactNode;
    current?: boolean;
    icon?: React.ElementType;
}

const base = classnames(
    'text-gray-300',
    'hover:bg-gray-700',
    'hover:text-white',
    'group',
    'flex',
    'items-center',
    'px-2',
    'py-2',
    'text-sm',
    'font-medium',
    'rounded-md',
);

const SidebarButton = ({
    children,
    current,
    icon: Icon,
}: ISidebarButtonProps) => {
    return (
        <a
            href="#"
            className={classnames(base, {
                'bg-gray-900': current,
                'text-white': current,
            })}
        >
            {Icon && (
                <Icon
                    className={classnames(
                        'group-hover:text-gray-300',
                        'mr-3',
                        'h-6',
                        'w-6',
                        {'text-gray-400': !current},
                        {'text-gray-300': current},
                    )}
                />
            )}
            {children}
        </a>
    );
};

export default SidebarButton;
