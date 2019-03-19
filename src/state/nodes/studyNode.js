//@flow
import gql from "graphql-tag";

// Example query to get studies
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

export type StudyFilesType = {
  edges: {
    node: {
      id: String,
      name?: String,
      downloadUrl?: URL
    }
  }
};

export type StudyDataType = {
  name: String,
  shortName?: String,
  bucket?: String,
  kfId: String,
  modifiedAt: String,
  files: StudyFilesType
};
