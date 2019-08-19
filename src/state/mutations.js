import gql from 'graphql-tag';
import {
  TOKEN_FIELDS,
  PROJECT_FIELDS,
  FILE_FIELDS,
  VERSION_FIELDS,
  STUDY_FIELDS,
} from './fragments';

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
        ...FileFields
      }
    }
  }
  ${FILE_FIELDS}
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
        ...FileFields
      }
    }
  }
  ${FILE_FIELDS}
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
  mutation($file: Upload!, $fileId: String!, $description: String!) {
    createVersion(file: $file, fileId: $fileId, description: $description) {
      success
      version {
        ...VersionFields
      }
    }
  }
  ${VERSION_FIELDS}
`;

// Mutation to update a version of a file
export const UPDATE_VERSION = gql`
  mutation($versionId: String!, $description: String, $state: VersionState!) {
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
  mutation($studyId: String!, $fileId: String!, $versionId: String) {
    signedUrl(studyId: $studyId, fileId: $fileId, versionId: $versionId) {
      url
    }
  }
`;

// Mutation to create a new dev token
export const CREATE_DEV_TOKEN = gql`
  mutation CreateToken($name: String!) {
    createDevToken(name: $name) {
      token {
        ...TokenFields
      }
    }
  }
  ${TOKEN_FIELDS}
`;

// Mutation to delete a token
export const DELETE_DEV_TOKEN = gql`
  mutation DeleteToken($name: String!) {
    deleteDevToken(name: $name) {
      name
      success
    }
  }
`;

// Mutation to create a new dev token
export const SYNC_PROJECTS = gql`
  mutation SyncProjects {
    syncProjects {
      updated {
        edges {
          node {
            ...ProjectFields
          }
        }
      }
      created {
        edges {
          node {
            ...ProjectFields
          }
        }
      }
    }
  }
  ${PROJECT_FIELDS}
`;

// Mutation to update current user's profile
export const UPDATE_PROFILE = gql`
  mutation($slackNotify: Boolean, $slackMemberId: String) {
    updateMyProfile(slackNotify: $slackNotify, slackMemberId: $slackMemberId) {
      user {
        id
        slackNotify
        slackMemberId
      }
    }
  }
`;

// Mutation to subscribe to a study
export const SUBSCRIBE_TO = gql`
  mutation($studyId: String!) {
    subscribeTo(studyId: $studyId) {
      user {
        id
        studySubscriptions {
          edges {
            node {
              id
              kfId
              name
            }
          }
        }
      }
    }
  }
`;

// Mutation to unsubscribe from a study
export const UNSUBSCRIBE_FROM = gql`
  mutation($studyId: String!) {
    unsubscribeFrom(studyId: $studyId) {
      user {
        id
        studySubscriptions {
          edges {
            node {
              id
              kfId
              name
            }
          }
        }
      }
    }
  }
`;

// Mutation to create a study
export const CREATE_STUDY = gql`
  mutation CREATE_STUDY($input: StudyInput!) {
    createStudy(input: $input) {
      study {
        ...StudyFields
      }
    }
  }
  ${STUDY_FIELDS}
`;
