import React from 'react';
import {MenuIcon} from '@heroicons/react/outline';
import {Logo} from '../../atoms';

export interface IMobileNavbar {
    onToggle: () => void;
}

export const MobileNavbar = ({onToggle}: IMobileNavbar) => (
    <div className="flex items-center justify-between bg-gray-800 border-b border-gray-200 px-4 py-1.5">
        <div className="h-10 w-10">
            <Logo />
        </div>
        <div>
            <button
                type="button"
                className="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-600 hover:text-gray-100"
                onClick={() => onToggle()}
            >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
    </div>
);
