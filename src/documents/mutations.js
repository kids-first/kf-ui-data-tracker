import gql from 'graphql-tag';
import {FILE_FIELDS, VERSION_FIELDS} from './fragments';

// Mutation to upload a file or a version of the file to the study-creator
export const CREATE_FILE = gql`
  mutation CreateFile(
    $file: Upload!
    $studyId: String!
    $name: String!
    $fileType: FileFileType!
    $description: String!
    $tags: [String]
  ) {
    createFile(
      file: $file
      studyId: $studyId
      name: $name
      fileType: $fileType
      description: $description
      tags: $tags
    ) {
      success
      file {
        ...FileFields
      }
    }
  }
  ${FILE_FIELDS}
`;

// Mutation to update file metadata
export const UPDATE_FILE = gql`
  mutation UpdateFile(
    $kfId: String!
    $name: String
    $description: String
    $fileType: FileFileType!
    $tags: [String]
  ) {
    updateFile(
      kfId: $kfId
      name: $name
      description: $description
      fileType: $fileType
      tags: $tags
    ) {
      file {
        ...FileFields
      }
    }
  }
  ${FILE_FIELDS}
`;

// Mutation to delete a file
export const DELETE_FILE = gql`
  mutation DeleteFile($kfId: String!) {
    deleteFile(kfId: $kfId) {
      kfId
      success
    }
  }
`;

// Mutation to upload a version of a file
export const CREATE_VERSION = gql`
  mutation CreateVersion(
    $file: Upload!
    $fileId: String
    $study: ID
    $description: String
  ) {
    createVersion(
      file: $file
      fileId: $fileId
      study: $study
      description: $description
    ) {
      success
      version {
        ...VersionFields
        analysis {
          id
          columns
          nrows
          ncols
          knownFormat
        }
      }
    }
  }
  ${VERSION_FIELDS}
`;

// Mutation to update a version of a file
export const UPDATE_VERSION = gql`
  mutation UpdateVersion(
    $versionId: String!
    $description: String
    $state: VersionState!
  ) {
    updateVersion(kfId: $versionId, description: $description, state: $state) {
      version {
        ...VersionFields
      }
    }
  }
  ${VERSION_FIELDS}
`;

// Mutation to get a signed url for a file or a version of the file
export const FILE_DOWNLOAD_URL = gql`
  mutation SignedUrl($studyId: String!, $fileId: String!, $versionId: String) {
    signedUrl(studyId: $studyId, fileId: $fileId, versionId: $versionId) {
      url
    }
  }
`;
