import gql from 'graphql-tag';

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
  }
`;
