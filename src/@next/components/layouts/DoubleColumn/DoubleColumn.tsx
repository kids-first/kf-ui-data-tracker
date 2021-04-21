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

const navigation: INavigationItem[] = [
    {name: 'Dashboard', href: '#', icon: HomeIcon, current: true},
    {name: 'Calendar', href: '#', icon: CalendarIcon, current: false},
    {name: 'Teams', href: '#', icon: UserGroupIcon, current: false},
    {name: 'Directory', href: '#', icon: SearchCircleIcon, current: false},
    {name: 'Announcements', href: '#', icon: SpeakerphoneIcon, current: false},
    {name: 'Office Map', href: '#', icon: MapIcon, current: false},
];

const Example = () => {
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
                <div className="flex-1 relative z-0 flex flex-col xl:flex-row-reverse overflow-hidden">
                    <aside className="flex-1 relative xl:flex-initial xl:flex-col xl:flex-shrink-0 xl:w-96 xl:border-l border-gray-200 bg-gray-50">
                        {/* Start secondary column */}
                        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                            <div className="h-full border-2 border-gray-200 border-dashed rounded-lg">
                                This is the sidebar content. It will become
                                inline on smaller breakpoints and order before
                                the main content.
                            </div>
                        </div>
                        {/* End secondary column */}
                    </aside>
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                        {/* Start main area*/}
                        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                            <div className="h-full border-2 border-gray-200 border-dashed rounded-lg">
                                This is the main content. It will become inline
                                on smaller breakpoints.
                            </div>
                        </div>
                        {/* End main area */}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Example;
