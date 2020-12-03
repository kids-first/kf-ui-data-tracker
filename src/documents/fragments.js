import gql from 'graphql-tag';
import {USER_FIELDS} from '../state/fragments';

export const INGEST_RUN_FIELDS = gql`
  fragment IngestRunFields on IngestRunNode {
    id
    name
    inputHash
    creator {
      ...UserFields
    }
    jobLog {
      id
    }
    versions { edges { node { id kfId } } }
    createdAt
  }
  ${USER_FIELDS}
`;
export const FILE_FIELDS = gql`
  fragment FileFields on FileNode {
    id
    kfId
    name
    description
    fileType
    downloadUrl
    tags
    validTypes
  }
`;

export const VERSION_FIELDS = gql`
  fragment VersionFields on VersionNode {
    id
    kfId
    fileName
    size
    state
    description
    createdAt
    downloadUrl
  }
`;
