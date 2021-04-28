import React, {useState} from 'react';
import {
    CalendarIcon,
    HomeIcon,
    MapIcon,
    SearchCircleIcon,
    SpeakerphoneIcon,
    UserGroupIcon,
} from '@heroicons/react/outline';
import {
    MobileNavbar,
    StaticSidebar,
    SlideoverSidebar,
} from '../../organisms/MainNavigation';
import {INavigationItem} from '../../../types';

export interface ISingleColumnProps {
    children: React.ReactNode;
}

const navigation: INavigationItem[] = [
    {name: 'Dashboard', href: '#', icon: HomeIcon, current: true},
    {name: 'Calendar', href: '#', icon: CalendarIcon, current: false},
    {name: 'Teams', href: '#', icon: UserGroupIcon, current: false},
    {name: 'Directory', href: '#', icon: SearchCircleIcon, current: false},
    {name: 'Announcements', href: '#', icon: SpeakerphoneIcon, current: false},
    {name: 'Office Map', href: '#', icon: MapIcon, current: false},
];

export const SingleColumn = ({children}: ISingleColumnProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="h-screen flex overflow-hidden bg-white">
            <div className="lg:hidden">
                <SlideoverSidebar
                    navigation={navigation}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            </div>
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <StaticSidebar navigation={navigation} />
                </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                <div className="lg:hidden">
                    <MobileNavbar
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                    />
                </div>
                <div className="flex-1 relative z-0 flex flex-col overflow-hidden">
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
