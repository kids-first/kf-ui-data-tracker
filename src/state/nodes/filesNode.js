import gql from 'graphql-tag';

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
