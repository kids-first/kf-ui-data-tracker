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

export const PROJECT_FIELDS = gql`
  fragment ProjectFields on ProjectNode {
    id
    createdBy
    createdOn
    description
    modifiedOn
    name
    projectId
    projectType
    url
    workflowType
  }
  ${STUDY_FIELDS}
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

export const CREATOR_FIELDS = gql`
  fragment CreatorFields on UserNode {
    id
    username
    email
    picture
  }
`;
