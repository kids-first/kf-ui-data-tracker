import React from 'react';
import {useValue} from 'react-cosmos/fixture';

import Input from './Input';

const Fixture = () => {
    const [label] = useValue('label', {defaultValue: 'Name'});
    const [placeholder] = useValue('placeholder', {
        defaultValue: 'Bobby Tables',
    });
    const [help] = useValue('help', {
        defaultValue:
            'Provide the first and last name of the resident at the address',
    });

    return (
        <div className="p-8">
            <Input
                id="field"
                label={label}
                placeholder={placeholder}
                help={help}
            />
        </div>
    );
};

export default Fixture;
