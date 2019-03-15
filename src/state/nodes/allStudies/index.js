import gql from 'graphql-tag';

// Example query to get studies
export const STUDY_QUERY = gql`
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

