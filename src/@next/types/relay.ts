export interface Node {
    __typename: string;
}

export interface Edge {
    __typename: string;
    node: Node;
}

export interface PageInfo {
    __typename: string;
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface Connection {
    __typename: string;
    pageInfo: PageInfo;
    edges: Edge[];
}
