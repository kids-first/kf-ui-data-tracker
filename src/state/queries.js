import gql from 'graphql-tag';

// Query to get all studies in the study-creator
export const ALL_STUDIES = gql`
  {
    allStudies {
      edges {
        node {
          id
          kfId
          name
          shortName
          createdAt
          modifiedAt
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
            fileType
            downloadUrl
            versions {
              edges {
                node {
                  id
                  size
                  createdAt
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
      kfId
      name
      description
      fileType
    }
  }
`;
