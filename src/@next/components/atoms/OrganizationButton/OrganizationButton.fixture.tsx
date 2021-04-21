import React from 'react';
import {OrganizationButton} from '.';
import {HomeIcon, CogIcon, UsersIcon} from '@heroicons/react/outline';

export default (
    <div className="p-4 bg-gray-100 h-screen max-h-96">
        <OrganizationButton current icon={HomeIcon}>
            Home
        </OrganizationButton>
        <OrganizationButton icon={CogIcon}>Settings</OrganizationButton>
        <OrganizationButton icon={UsersIcon}>Users</OrganizationButton>
    </div>
);
