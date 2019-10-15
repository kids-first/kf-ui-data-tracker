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

export const STUDY_BASIC_FIELDS = gql`
  fragment StudyBasicFields on StudyNode {
    id
    name
    shortName
    kfId
    createdAt
    modifiedAt
  }
`;

export const STUDY_INFO_FIELDS = gql`
  fragment StudyInfoFields on StudyNode {
    bucket
    attribution
    dataAccessAuthority
    externalId
    releaseStatus
    version
    releaseDate
    description
    anticipatedSamples
    awardeeOrganization
  }
`;

export const EVENT_FIELDS = gql`
  fragment EventFields on EventNode {
    id
    uuid
    createdAt
    eventType
    description
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
    deleted
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
