import React from 'react';
import {OrganizationMenu} from '../../organisms';
import {ProfileMenu} from '../../molecules';
import {SidebarButton} from '../../atoms';
import {INavigationItem} from '../../../types';

export interface IStaticSidebar {
    navigation: INavigationItem[];
}

export const StaticSidebar = ({navigation}: IStaticSidebar) => {
    return (
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-gray-800">
            <div className="flex-1 flex flex-col overflow-y-auto">
                <OrganizationMenu name="My DCC" />
                <nav className="mt-2 flex-1" aria-label="Sidebar">
                    <div className="px-2 space-y-1">
                        {navigation.map(item => (
                            <SidebarButton
                                icon={item.icon}
                                current={item.current}
                            >
                                {item.name}
                            </SidebarButton>
                        ))}
                    </div>
                </nav>
            </div>
            <div className="border-t-2 border-primary-400">
                <ProfileMenu
                    name={'Boby Tables'}
                    avatarSrc={
                        'https://images.unsplash.com/photo-1545996124-0501ebae84d0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80'
                    }
                />
            </div>
        </div>
    );
};
