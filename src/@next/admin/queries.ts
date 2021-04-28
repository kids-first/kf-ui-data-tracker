import {gql} from '@apollo/client';

import {USER_FIELDS} from './fragments';

export const ALL_USERS = gql`
    query AllUsers($before: String, $after: String, $first: Int, $last: Int) {
        allUsers(before: $before, after: $after, first: $first, last: $last) {
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            edges {
                cursor
                node {
                    id
                    ...UserFields
                }
            }
        }
    }
    ${USER_FIELDS}
`;
