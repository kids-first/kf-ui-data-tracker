import React from 'react';
import {useSelect} from 'react-cosmos/fixture';

import {Badge} from './Badge';

const Fixture = () => {
    const [color] = useSelect('color', {
        options: [
            'gray',
            'red',
            'yellow',
            'green',
            'blue',
            'indigo',
            'purple',
            'pink',
        ],
    });

    return (
        <div className="p-8">
            <Badge color={color}>5 new messages</Badge>
        </div>
    );
};

export default Fixture;
