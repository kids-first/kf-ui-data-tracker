import {gql} from '@apollo/client';

export const USER_FIELDS = gql`
    fragment UserFields on UserNode {
        id
        displayName
        dateJoined
        username
        email
        picture
    }
`;
