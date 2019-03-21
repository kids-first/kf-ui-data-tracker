import gql from 'graphql-tag';

// Mutation to upload a file to the study-creator
export const CREATE_FILE = gql`
  mutation($file: Upload!, $studyId: String!) {
    createFile(file: $file, studyId: $studyId) {
      success
      file {
        id
        name
        downloadUrl
      }
    }
  }
`;
