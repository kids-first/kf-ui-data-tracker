import gql from 'graphql-tag';

// Mutation to upload a file to the study-creator
export const CREATE_FILE = gql`
  mutation($file: Upload!, $studyId: String!) {
    createFile(file: $file, studyId: $studyId) {
      success
      file {
        id
        kfId
        name
        downloadUrl
      }
    }
  }
`;

// Mutation to update file metadata
export const UPDATE_FILE = gql`
  mutation($kfId: String!, $name: String, $description: String) {
    updateFile(kfId: $kfId, name: $name, description: $description) {
      file {
        id
        kfId
        name
        description
      }
    }
  }
`;

// Mutation to delete a file
export const DELETE_FILE = gql`
  mutation($kfId: String!) {
    deleteFile(kfId: $kfId) {
      success
    }
  }
`;
