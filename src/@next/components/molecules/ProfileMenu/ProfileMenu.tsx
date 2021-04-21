import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from '../../atoms/Avatar';

export interface IProfileMenuProps {
    name: string;
    avatarSrc: string;
}

export const ProfileMenu = ({name, avatarSrc}: IProfileMenuProps) => (
    <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <Link to="/" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
                <div>
                    <Avatar size="medium" src={avatarSrc} alt="User avatar" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                        View profile
                    </p>
                </div>
            </div>
        </Link>
    </div>
);
