import gql from 'graphql-tag';
import {
  PROJECT_FIELDS,
  STUDY_BASIC_FIELDS,
  STUDY_INFO_FIELDS,
  EVENT_FIELDS,
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
          ...StudyInfoFields
          projects {
            edges {
              node {
                ...ProjectFields
              }
            }
          }
          files {
            edges {
              node {
                id
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
  ${PROJECT_FIELDS}
  ${STUDY_BASIC_FIELDS}
  ${STUDY_INFO_FIELDS}
`;

// Query to get a study by its relay id
export const GET_STUDY_BY_ID = gql`
  query Study($kfId: String!) {
    studyByKfId(kfId: $kfId) {
      ...StudyBasicFields
      ...StudyInfoFields
      collaborators {
        edges {
          node {
            ...UserFields
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
          email
          picture
          roles
          groups
          lastLogin
          dateJoined
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
      jobs {
        edges {
          node {
            id
            name
            active
            failing
            lastRun
            lastError
            createdOn
            enqueuedAt
          }
        }
      }
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
  query allStudies {
    allStudies {
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
