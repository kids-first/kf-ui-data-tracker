import React from 'react';
import classnames from 'classnames';
import {IOrganization} from '../../../types';
import {Logo} from '../../atoms';

export interface IOrganizationSwitcherProps {
    organizations: IOrganization[];
}

const baseItem = classnames(
    'py-4',
    'px-2',
    'flex',
    'bg-white',
    'hover:bg-gray-50',
    'cursor-pointer',
);

export const OrganizationSwitcher = ({
    organizations,
}: IOrganizationSwitcherProps) => {
    return (
        <ul className="fixed w-72 rounded-md border border-gray-200 shadow-lg m-2 divide-y divide-gray-200">
            {organizations.map(organization => (
                <li
                    key={organization.name}
                    className={classnames(baseItem, {
                        'bg-gray-100': organization.active,
                        'hover:bg-gray-100': organization.active,
                    })}
                >
                    <div className="w-10 h-10 rounded-full">
                        <Logo />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            {organization.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {organization.studies} studies
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
};
