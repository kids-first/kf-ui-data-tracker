import React from 'react';

import Avatar, {AvatarSize} from './Avatar';

const Fixture = () => {
    const options: AvatarSize[] = [
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
    ];

    return (
        <div className="p-8 space-x-4">
            {options.map(size => (
                <Avatar
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=6DUQn1Pc44&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Avatar for user"
                    size={size}
                />
            ))}
        </div>
    );
};

export default Fixture;
