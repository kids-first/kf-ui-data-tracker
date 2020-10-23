import gql from 'graphql-tag';
import {USER_FIELDS} from '../state/fragments';

export const RELEASE_FIELDS = gql`
  fragment ReleaseFields on ReleaseNode {
    id
    kfId
    name
    description
    state
    creator {
      ...UserFields
    }
    version
    createdAt
    isMajor
  }
  ${USER_FIELDS}
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
