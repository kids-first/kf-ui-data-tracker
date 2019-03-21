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
        }
      }
    }
  }
`;

// Query to get a study by its relay id
export const GET_STUDY_BY_ID = gql`
  query Study($id: ID!) {
    study(id: $id) {
      name
      shortName
      bucket
      kfId
      modifiedAt
      files {
        edges {
          node {
            id
            name
            downloadUrl
          }
        }
      }
    }
  }
`;
