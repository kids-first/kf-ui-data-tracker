import React from 'react';
import SidebarNav from '../../organisms/SidebarNav';

const Sidebar = () => (
    <div className="h-screen flex overflow-hidden bg-gray-100">
        <div className="flex flex-col w-64">
            <SidebarNav />
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Page Title
                        </h1>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="py-4">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
);

export default Sidebar;
