import gql from 'graphql-tag';

export const STUDY_BASIC_FIELDS = gql`
  fragment StudyBasicFields on StudyNode {
    id
    name
    shortName
    kfId
    investigatorName
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
    sequencingStatus
    ingestionStatus
    phenotypeStatus
    slackNotify
    slackChannel
    additionalFields
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
    displayName
  }
`;

export const GROUP_FIELDS = gql`
  fragment GroupFields on UserNode {
    groups {
      edges {
        node {
          id
          name
          permissions {
            edges {
              node {
                id
                name
                codename
              }
            }
          }
        }
      }
    }
  }
`;

export const USER_FIELDS = gql`
  fragment UserFields on UserNode {
    id
    displayName
    dateJoined
    username
    email
    picture
  }
`;

export const VALIDATION_RESULT_FIELDS = gql`
  fragment ValidationResultsetFields on ValidationResultsetNode {
    id
    createdAt
    reportFile
    resultsFile
    passed
    failed
    didNotRun
    downloadReportUrl
    downloadResultsUrl
  }
`;

export const VALIDATION_RUN_FIELDS = gql`
  fragment ValidationRunFields on ValidationRunNode {
    id
    createdAt
    startedAt
    stoppedAt
    inputHash
    state
    success
    progress
  }
`;
