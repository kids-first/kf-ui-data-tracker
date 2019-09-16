import gql from 'graphql-tag';
import {
  TOKEN_FIELDS,
  PROJECT_FIELDS,
  CREATOR_FIELDS,
  STUDY_BASIC_FIELDS,
  STUDY_INFO_FIELDS,
  FILE_FIELDS,
  VERSION_FIELDS,
  EVENT_FIELDS,
} from './fragments';

// Query to get all studies in the study-creator
export const ALL_STUDIES = gql`
  {
    allStudies {
      edges {
        node {
          ...StudyBasicFields
          files {
            edges {
              node {
                versions(first: 1, orderBy: "-created_at") {
                  edges {
                    node {
                      id
                      state
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
`;

// Query to get a study by its relay id
export const GET_STUDY_BY_ID = gql`
  query Study($kfId: String!) {
    studyByKfId(kfId: $kfId) {
      ...StudyBasicFields
      ...StudyInfoFields
      events(first: 10, orderBy: "-created_at") {
        edges {
          node {
            ...EventFields
          }
        }
      }
      projects {
        edges {
          node {
            ...ProjectFields
            study {
              ...StudyBasicFields
            }
          }
        }
      }
      files {
        edges {
          node {
            ...FileFields
            versions {
              edges {
                node {
                  id
                  size
                  createdAt
                  state
                }
              }
            }
          }
        }
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
  ${STUDY_INFO_FIELDS}
  ${FILE_FIELDS}
  ${EVENT_FIELDS}
  ${PROJECT_FIELDS}
`;

// Query to get a file by its kf id
export const GET_FILE_BY_ID = gql`
  query File($kfId: String!) {
    fileByKfId(kfId: $kfId) {
      ...FileFields
      creator {
        ...CreatorFields
      }
      versions {
        edges {
          node {
            ...VersionFields
            downloadUrl
            creator {
              ...CreatorFields
            }
          }
        }
      }
    }
  }
  ${FILE_FIELDS}
  ${VERSION_FIELDS}
  ${CREATOR_FIELDS}
`;

// Query to get developer tokens
export const GET_DEV_TOKENS = gql`
  query DevTokens {
    allDevTokens {
      edges {
        node {
          ...TokenFields
        }
      }
    }
  }
  ${TOKEN_FIELDS}
`;

// Query to get Cavatica projects registered in the study creator
export const GET_PROJECTS = gql`
  query CavaticaProjects($study: ID, $deleted: Boolean) {
    allProjects(study: $study, deleted: $deleted) {
      edges {
        node {
          ...ProjectFields
          study {
            ...StudyBasicFields
          }
        }
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
  ${PROJECT_FIELDS}
`;

// Query to get the current user's profile
export const MY_PROFILE = gql`
  {
    myProfile {
      roles
      groups
      id
      username
      firstName
      lastName
      picture
      email
      slackNotify
      slackMemberId
      studySubscriptions {
        edges {
          node {
            id
            kfId
            name
          }
        }
      }
    }
  }
`;
// Get all users
export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      edges {
        node {
          id
          username
        }
      }
    }
  }
`;

// Get all events
export const ALL_EVENTS = gql`
  query AllEvents(
    $studyId: String
    $fileId: String
    $versionId: String
    $createdAfter: DateTime
    $createdBefore: DateTime
    $username: String
    $eventType: String
    $orderBy: String
  ) {
    allEvents(
      studyKfId: $studyId
      fileKfId: $fileId
      versionKfId: $versionId
      createdAfter: $createdAfter
      createdBefore: $createdBefore
      username: $username
      eventType: $eventType
      orderBy: $orderBy
    ) {
      edges {
        node {
          ...EventFields
          study {
            ...StudyBasicFields
          }
          project {
            ...ProjectFields
          }
          file {
            ...FileFields
          }
          version {
            ...VersionFields
          }
        }
      }
    }
  }
  ${EVENT_FIELDS}
  ${STUDY_BASIC_FIELDS}
  ${FILE_FIELDS}
  ${VERSION_FIELDS}
  ${PROJECT_FIELDS}
`;
