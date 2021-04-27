import React from 'react';
import {SidebarButton} from '.';

import {HomeIcon, CogIcon, UsersIcon} from '@heroicons/react/outline';

export default (
    <div className="p-4 bg-gray-800 h-screen max-h-96">
        <SidebarButton current icon={HomeIcon}>
            Home
        </SidebarButton>
        <SidebarButton icon={CogIcon}>Settings</SidebarButton>
        <SidebarButton icon={UsersIcon}>Users</SidebarButton>
    </div>
);
