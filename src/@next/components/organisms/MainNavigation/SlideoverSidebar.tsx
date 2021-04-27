import {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import {OrganizationMenu} from '../../organisms';
import {ProfileMenu} from '../../molecules';
import {SidebarButton} from '../../atoms';
import {INavigationItem} from '../../../types';

export interface ISlideoverSidebar {
    navigation: INavigationItem[];
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const SlideoverSidebar = ({
    navigation,
    sidebarOpen,
    setSidebarOpen,
}: ISlideoverSidebar) => {
    return (
        <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed inset-0 flex z-40"
                open={sidebarOpen}
                onClose={setSidebarOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 focus:outline-none">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sr-only">
                                        Close sidebar
                                    </span>
                                    <XIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </Transition.Child>
                        <div className="flex-1 h-0 overflow-y-auto">
                            <OrganizationMenu name="My DCC" />
                            <nav aria-label="Sidebar" className="mt-2">
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
                        <ProfileMenu
                            name={'Boby Tables'}
                            avatarSrc={
                                'https://images.unsplash.com/photo-1545996124-0501ebae84d0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80'
                            }
                        />
                    </div>
                </Transition.Child>
                <div className="flex-shrink-0 w-14" aria-hidden="true">
                    {/* Force sidebar to shrink to fit close icon */}
                </div>
            </Dialog>
        </Transition.Root>
    );
};
