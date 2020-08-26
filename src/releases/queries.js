import gql from 'graphql-tag';
import {RELEASE_FIELDS} from './fragments';

export const GET_RELEASES = gql`
  query AllReleases {
    allReleases(first: 10, orderBy: "-created_at") {
      edges {
        node {
          ...ReleaseFields
        }
      }
    }
  }
  ${RELEASE_FIELDS}
`;
