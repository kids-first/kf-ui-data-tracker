import React from 'react';
import {UserList} from '.';
import {UserNodeEdge} from '../../../types';

const users: UserNodeEdge[] = [
    {
        __typename: 'UserNodeEdge',
        node: {
            __typename: 'UserNode',
            id: 'abc',
            displayName: 'Bobby Tables',
            dateJoined: new Date(),
            username: 'Bobby',
            email: 'user@example.com',
            picture: 'avatar',
        },
        cursor: 'abc',
    },
];

export default <UserList users={users} />;
