import React from 'react';

import ProfileMenu from '../../molecules/ProfileMenu';
import Logo from '../../atoms/Logo';
import SidebarButton from '../../atoms/SidebarButton';
import {
    BookOpenIcon,
    PencilAltIcon,
    SelectorIcon,
    TagIcon,
} from '@heroicons/react/outline';

export interface ISidebarNavProps {}

const SidebarNav = () => {
    return (
        <div className="flex flex-col h-screen flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4 py-2 bg-gray-900 hover:bg-gray-700 cursor-pointer">
                    <Logo />
                    <div className="ml-3">
                        <p className="text-md font-medium text-white">
                            Organization Name
                        </p>
                        <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                            Settings
                        </p>
                        <SelectorIcon className="h-6 w-6 text-white" />
                    </div>
                </div>

                <nav
                    className="mt-5 flex-1 px-2 bg-gray-800 space-y-1"
                    aria-label="Sidebar"
                >
                    <SidebarButton current icon={BookOpenIcon}>
                        Studies
                    </SidebarButton>
                    <SidebarButton icon={PencilAltIcon}>Reviews</SidebarButton>
                    <SidebarButton icon={TagIcon}>Releases</SidebarButton>
                </nav>
            </div>
            <ProfileMenu
                name="Bobby Tables"
                avatarSrc="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
            />
        </div>
    );
};

export default SidebarNav;
