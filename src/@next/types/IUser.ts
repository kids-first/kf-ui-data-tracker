import {Connection, Edge, Node} from '.';

export interface IUser {
    id: string;
    displayName: string;
    dateJoined: Date;
    username: string;
    email: string;
    picture: string;
}

export interface UserNode extends IUser, Node {}

export interface UserNodeEdge extends Edge {
    __typename: 'UserNodeEdge';
    node: UserNode;
    cursor: string;
}

export interface UserNodeConnection extends Connection {
    __typename: 'UserNodeConnection';
    edges: UserNodeEdge[];
}

export interface AllUsers {
    allUsers: UserNodeConnection;
}

export interface AllUsersVars {
    after?: string;
    before?: string;
    limit?: number;
    first?: number;
    last?: number;
    orderBy?: string;
}
