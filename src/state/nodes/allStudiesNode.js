import gql from "graphql-tag";

// Example query to get studies
export const ALL_STUDIES_QUERY = gql`
  query AllStudies {
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
