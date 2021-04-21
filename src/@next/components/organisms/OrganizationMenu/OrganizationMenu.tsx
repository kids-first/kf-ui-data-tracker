import {Fragment, useState} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {
    CalendarIcon,
    HomeIcon,
    SelectorIcon,
    UserGroupIcon,
    RefreshIcon,
} from '@heroicons/react/outline';
import {OrganizationButton, Logo} from '../../atoms';
import {OrganizationSwitcher} from '../../molecules';
import {INavigationItem} from '../../../types';

export interface IOrganizationMenuProps {
    name: String;
}

const organizations = [
    {name: 'Kids First DCC', logo: 'blah', studies: 55, active: true},
    {name: 'CBTN', logo: 'blah', studies: 13, active: false},
    {name: 'CCDI', logo: 'blah', studies: 5, active: false},
];

const navigation: INavigationItem[] = [
    {name: 'Dashboard', href: '#', icon: HomeIcon, current: true},
    {name: 'Calendar', href: '#', icon: CalendarIcon, current: false},
    {name: 'Switch', href: '#', icon: UserGroupIcon, current: false},
];

export const OrganizationMenu = ({name}: IOrganizationMenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <div
                className="z-10 flex items-center flex-shrink-0 px-4 py-2 bg-gray-900 hover:bg-gray-700 cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <div className="w-10 h-10">
                    <Logo />
                </div>
                <div className="ml-3 flex-grow">
                    <p className="text-md font-medium text-white">{name}</p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                        Settings
                    </p>
                </div>
                <SelectorIcon className="h-6 w-6 text-white" />
            </div>
            <Transition
                show={menuOpen}
                className="relative"
                enter="transform origin-top transition-all duration-150"
                enterFrom="-translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition-all duration-150"
                leaveFrom="translate-y-0"
                leaveTo="-translate-y-full"
            >
                <div className="bg-gray-100">
                    {navigation.map(item => (
                        <OrganizationButton
                            icon={item.icon}
                            current={item.current}
                        >
                            {item.name}
                        </OrganizationButton>
                    ))}
                    <Popover className="relative">
                        <Popover.Button className="w-full">
                            <OrganizationButton icon={RefreshIcon}>
                                Switch Organization
                            </OrganizationButton>
                        </Popover.Button>

                        <Popover.Panel className="absolute w-full -top-3/4 z-20">
                            <div className="relative left-full">
                                <OrganizationSwitcher
                                    organizations={organizations}
                                />
                            </div>
                        </Popover.Panel>
                    </Popover>
                </div>
            </Transition>
        </>
    );
};
