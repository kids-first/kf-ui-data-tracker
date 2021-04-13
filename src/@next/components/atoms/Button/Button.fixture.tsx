import React from 'react';
import {useSelect} from 'react-cosmos/fixture';
import {Button, ButtonSize} from '.';

const ButtonFixture = () => {
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
    const [size] = useSelect('size', {
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    });

    return (
        <div className="p-8">
            <Button color={color} size={size}>
                Save
            </Button>
        </div>
    );
};

export default ButtonFixture;
