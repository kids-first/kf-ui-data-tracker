import gql from 'graphql-tag';

export const RELEASE_FIELDS = gql`
  fragment ReleaseFields on ReleaseNode {
    id
    kfId
    name
    description
    state
    author
    version
    createdAt
  }
`;
