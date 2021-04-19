import React from 'react';
import {MobileNavbar, StaticSidebar, SlideoverSidebar} from '.';
import {INavigationItem} from '../../../types';
import {
    CalendarIcon,
    HomeIcon,
    MapIcon,
    SearchCircleIcon,
    SpeakerphoneIcon,
    UserGroupIcon,
} from '@heroicons/react/outline';

const navigation: INavigationItem[] = [
    {name: 'Dashboard', href: '#', icon: HomeIcon, current: true},
    {name: 'Calendar', href: '#', icon: CalendarIcon, current: false},
    {name: 'Teams', href: '#', icon: UserGroupIcon, current: false},
    {name: 'Directory', href: '#', icon: SearchCircleIcon, current: false},
    {name: 'Announcements', href: '#', icon: SpeakerphoneIcon, current: false},
    {name: 'Office Map', href: '#', icon: MapIcon, current: false},
];

const examples = {
    StaticSidebar: (
        <div className="flex flex-col h-screen">
            <StaticSidebar navigation={navigation} />
        </div>
    ),
    SlideoverSidebar: (
        <div className="flex flex-col h-screen">
            <SlideoverSidebar
                navigation={navigation}
                sidebarOpen={true}
                setSidebarOpen={open => null}
            />
        </div>
    ),
    MobileNavbar: (
        <div className="flex flex-col h-screen">
            <MobileNavbar onToggle={() => null} />
        </div>
    ),
};

export default examples;
