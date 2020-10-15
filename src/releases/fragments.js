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
    isMajor
  }
`;

export const SERVICE_FIELDS = gql`
  fragment ServiceFields on TaskServiceNode {
    id
    author
    kfId
    name
    createdAt
    description
    healthStatus
    enabled
    url
  }
`;
