import gql from 'graphql-tag';
import {
  TOKEN_FIELDS,
  CREATOR_FIELDS,
  STUDY_FIELDS,
  FILE_FIELDS,
  VERSION_FIELDS,
} from './fragments';

// Query to get all studies in the study-creator
export const ALL_STUDIES = gql`
  {
    allStudies {
      edges {
        node {
          ...StudyFields
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
  ${STUDY_FIELDS}
`;

// Query to get a study by its relay id
export const GET_STUDY_BY_ID = gql`
  query Study($kfId: String!) {
    studyByKfId(kfId: $kfId) {
      ...StudyFields
      bucket
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
  ${STUDY_FIELDS}
  ${FILE_FIELDS}
`;

// Query to get a file by its kf id
export const GET_FILE_BY_ID = gql`
  query File($kfId: String!) {
    fileByKfId(kfId: $kfId) {
      ...FileFields
      creator {
        id
        username
        email
        picture
      }
      versions {
        edges {
          node {
            ...VersionFields
            downloadUrl
            creator {
              id
              username
              email
              picture
            }
          }
        }
      }
    }
  }
  ${FILE_FIELDS}
  ${VERSION_FIELDS}
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

// Query to get the current user's profile
export const MY_PROFILE = gql`
  {
    myProfile {
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
