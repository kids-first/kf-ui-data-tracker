import gql from 'graphql-tag';

export const TOKEN_FIELDS = gql`
  fragment TokenFields on DevDownloadTokenNode {
    id
    name
    token
    createdAt
    creator {
      username
      picture
    }
  }
`;

export const STUDY_FIELDS = gql`
  fragment StudyFields on StudyNode {
    id
    kfId
    name
    shortName
    createdAt
    modifiedAt
  }
`;

export const FILE_FIELDS = gql`
  fragment FileFields on FileNode {
    id
    kfId
    name
    description
    fileType
    downloadUrl
  }
`;
