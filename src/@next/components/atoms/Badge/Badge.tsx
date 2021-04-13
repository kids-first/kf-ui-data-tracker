import React from 'react';

export interface IBadgeProps {
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

export const Badge = ({color, children}: IBadgeProps) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
        {children}
    </span>
);

export default Badge;
