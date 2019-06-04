import gql from 'graphql-tag';

// Mutation to upload a file or a version of the file to the study-creator
export const CREATE_FILE = gql`
  mutation(
    $file: Upload!
    $studyId: String!
    $name: String!
    $fileType: FileFileType!
    $description: String!
  ) {
    createFile(
      file: $file
      studyId: $studyId
      name: $name
      fileType: $fileType
      description: $description
    ) {
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
      kfId
      success
    }
  }
`;

// Mutation to upload a version of a file
export const CREATE_VERSION = gql`
  mutation(
    $file: Upload!
    $fileId: String!
    $description: String!
  ) {
    createVersion(
      file: $file
      fileId: $fileId
      description: $description
    ) {
      success
      version {
        id
        kfId
        fileName
        description
        state
        createdAt
        size
      }
    }
  }
`;

// Mutation to get a signed url for a file or a version of the file
export const FILE_DOWNLOAD_URL = gql`
  mutation($studyId: String!, $fileId: String!, $versionId: String) {
    signedUrl(studyId: $studyId, fileId: $fileId, versionId: $versionId) {
      url
    }
  }
`;

// Mutation to create a new dev token
export const CREATE_DEV_TOKEN = gql`
  mutation($name: String!) {
    createDevToken(name: $name) {
      token {
        id
        name
        token
        createdAt
      }
    }
  }
`;

// Mutation to delete a token
export const DELETE_DEV_TOKEN = gql`
  mutation($name: String!) {
    deleteDevToken(name: $name) {
      name
      success
    }
  }
`;
