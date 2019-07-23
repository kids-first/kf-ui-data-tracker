import gql from 'graphql-tag';

// Query to get all studies in the study-creator
export const ALL_STUDIES = gql`
  {
    allStudies {
      edges {
        node {
          shortName
          name
          kfId
          id
          createdAt
          modifiedAt
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
`;

// Query to get a study by its relay id
export const GET_STUDY_BY_ID = gql`
  query Study($kfId: String!) {
    studyByKfId(kfId: $kfId) {
      id
      name
      shortName
      bucket
      kfId
      modifiedAt
      files {
        edges {
          node {
            id
            kfId
            name
            fileType
            description
            downloadUrl
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
`;

// Query to get a file by its kf id
export const GET_FILE_BY_ID = gql`
  query File($kfId: String!) {
    fileByKfId(kfId: $kfId) {
      id
      kfId
      name
      description
      fileType
      downloadUrl
      creator {
        id
        username
        email
        picture
      }
      versions {
        edges {
          node {
            id
            kfId
            createdAt
            size
            downloadUrl
            state
            description
            fileName
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
`;

// Query to get developer tokens
export const GET_DEV_TOKENS = gql`
  {
    allDevTokens {
      edges {
        node {
          id
          name
          token
          createdAt
          creator {
            username
            picture
          }
        }
      }
    }
  }
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
