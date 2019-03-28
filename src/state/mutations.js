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
        description
        fileType
        downloadUrl
      }
    }
  }
`;

// Mutation to update file metadata
export const UPDATE_FILE = gql`
  mutation(
    $kfId: String!
    $name: String
    $description: String
    $fileType: FileFileType!
  ) {
    updateFile(
      kfId: $kfId
      name: $name
      description: $description
      fileType: $fileType
    ) {
      file {
        id
        kfId
        name
        description
        fileType
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

// Mutation to get a signed url for a file
export const FILE_DOWNLOAD_URL = gql`
  mutation($studyId: String!, $fileId: String!) {
    signedUrl(studyId: $studyId, fileId: $fileId) {
      url
    }
  }
`;
