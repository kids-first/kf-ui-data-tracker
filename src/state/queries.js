import gql from 'graphql-tag';
import {
  PROJECT_FIELDS,
  STUDY_BASIC_FIELDS,
  STUDY_INFO_FIELDS,
  EVENT_FIELDS,
  GROUP_FIELDS,
  USER_FIELDS,
} from './fragments';
import {FILE_FIELDS, VERSION_FIELDS} from '../documents/fragments';

// Query to get all studies in the study-creator
export const ALL_STUDIES = gql`
  query AllStudies {
    allStudies {
      edges {
        node {
          ...StudyBasicFields
          bucket
          externalId
          version
          anticipatedSamples
          slackChannel
          sequencingStatus
          ingestionStatus
          phenotypeStatus
          releases(first: 1, orderBy: "-created_at", state: "published") {
            edges {
              node {
                id
                kfId
                name
                version
                createdAt
                creator {
                  ...UserFields
                }
              }
            }
          }
          collaborators {
            edges {
              node {
                ...UserFields
              }
            }
          }
        }
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
  ${USER_FIELDS}
`;

// Query to get a study by its relay id
export const GET_STUDY_BY_ID = gql`
  query Study($id: ID!) {
    study(id: $id) {
      ...StudyBasicFields
      ...StudyInfoFields
      collaborators {
        edges {
          invitedBy {
            ...UserFields
          }
          joinedOn
          role
          node {
            ...UserFields
            ...GroupFields
          }
        }
      }
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
                  kfId
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
  ${USER_FIELDS}
  ${GROUP_FIELDS}
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
  query MyProfile {
    myProfile {
      id
      slackNotify
      slackMemberId
      firstName
      lastName
      studies {
        edges {
          node {
            id
            kfId
            name
          }
        }
      }
      studySubscriptions {
        edges {
          node {
            id
            kfId
            name
          }
        }
      }
      ...UserFields
      ...GroupFields
    }
  }
  ${USER_FIELDS}
  ${GROUP_FIELDS}
`;

// Get all users
export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      edges {
        node {
          id
          ...UserFields
        }
      }
    }
  }
  ${USER_FIELDS}
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
    $first: Int
    $cursor: String
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
      first: $first
      after: $cursor
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
          user {
            ...UserFields
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${EVENT_FIELDS}
  ${STUDY_BASIC_FIELDS}
  ${FILE_FIELDS}
  ${VERSION_FIELDS}
  ${PROJECT_FIELDS}
  ${USER_FIELDS}
`;

// Get study-creator api version status
export const STATUS = gql`
  query Status {
    status {
      name
      version
      commit
      features {
        studyCreation
        studyUpdates
        cavaticaCreateProjects
        cavaticaCopyUsers
        cavaticaMountVolumes
        studyBucketsCreateBuckets
      }
      settings {
        developmentEndpoints
        dataserviceUrl
        cavaticaUrl
        cavaticaDeliveryAccount
        cavaticaHarmonizationAccount
        cavaticaUserAccessProject
        studyBucketsRegion
        studyBucketsLoggingBucket
        studyBucketsDrRegion
        studyBucketsDrLoggingBucket
        studyBucketsInventoryLocation
        studyBucketsLogPrefix
      }
      queues
    }
  }
`;

export const GET_STUDY_RELEASES = gql`
  query GetStudyReleases($id: ID!) {
    study(id: $id) {
      id
      releases(state: "published", orderBy: "-created_at") {
        edges {
          node {
            id
            kfId
            name
            description
            state
            author
            version
            createdAt
          }
        }
      }
    }
  }
`;

export const GET_RELEASED_STUDY = gql`
  query allStudyReleases {
    allStudyReleases: allStudies {
      edges {
        node {
          id
          kfId
          releases(state: "published", first: 1, orderBy: "-created_at") {
            edges {
              node {
                id
                kfId
                name
                description
                state
                author
                version
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;

export const ALL_GROUPS = gql`
  query allGroups {
    allGroups {
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

export const FEATURES = gql`
  query features {
    __type(name: "Features") {
      name
      fields {
        name
      }
    }
  }
`;

export const SETTINGS = gql`
  query settings {
    __type(name: "Settings") {
      name
      fields {
        name
      }
    }
  }
`;
