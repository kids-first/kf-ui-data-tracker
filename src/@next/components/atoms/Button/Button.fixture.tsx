import React from 'react';
import {useSelect} from 'react-cosmos/fixture';
import {Button, ButtonSize} from '.';

const ButtonFixture = () => {
    const options: ButtonSize[] = [
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
    ];
    const [color] = useSelect('color', {
        options: [
            'primary',
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
        <div className="p-8 space-x-4">
            {options.map(size => (
                <Button color={color} size={size}>
                    Save
                </Button>
            ))}
        </div>
    );
};

export default ButtonFixture;
