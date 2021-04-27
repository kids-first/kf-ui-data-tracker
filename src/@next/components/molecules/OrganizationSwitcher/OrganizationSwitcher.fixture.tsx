import React from 'react';
import {OrganizationSwitcher} from '.';

const organizations = [
    {name: 'Kids First DCC', logo: 'blah', studies: 55, active: true},
    {name: 'CBTN', logo: 'blah', studies: 13, active: false},
    {name: 'CCDI', logo: 'blah', studies: 5, active: false},
];
export default (
    <div className="w-1/2 mx-auto">
        <OrganizationSwitcher organizations={organizations} />
    </div>
);
