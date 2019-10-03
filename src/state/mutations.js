import gql from 'graphql-tag';
import {
  TOKEN_FIELDS,
  PROJECT_FIELDS,
  FILE_FIELDS,
  VERSION_FIELDS,
  STUDY_BASIC_FIELDS,
  STUDY_INFO_FIELDS,
} from './fragments';

// Mutation to upload a file or a version of the file to the study-creator
export const CREATE_FILE = gql`
  mutation CreateFile(
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
  mutation UpdateFile(
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
    $fileId: String!
    $description: String!
  ) {
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
      id
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
      deleted {
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
  mutation UpdateMyProfile($slackNotify: Boolean, $slackMemberId: String) {
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
  mutation SubscribeTo($studyId: String!) {
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
  mutation UnsubscribeFrom($studyId: String!) {
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
  mutation CREATE_STUDY($input: StudyInput!, $workflows: [WorkflowType]) {
    createStudy(input: $input, workflows: $workflows) {
      study {
        ...StudyBasicFields
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
`;

// Mutation to update a study
export const UPDATE_STUDY = gql`
  mutation UPDATE_STUDY($id: ID!, $input: StudyInput!) {
    updateStudy(id: $id, input: $input) {
      study {
        ...StudyBasicFields
        ...StudyInfoFields
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
  ${STUDY_INFO_FIELDS}
`;

// Mutation to create a new analysis project
export const CREATE_PROJECT = gql`
  mutation CreateProject($workflowType: WorkflowType!, $study: ID!) {
    createProject(input: {workflowType: $workflowType, study: $study}) {
      project {
        ...ProjectFields
      }
    }
  }
  ${PROJECT_FIELDS}
`;

// Mutation to update a project
export const UPDATE_PROJECT = gql`
  mutation UPDATE_PROJECT($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      project {
        ...ProjectFields
      }
    }
  }
  ${PROJECT_FIELDS}
`;

// Mutation to link an exist analysis project
export const LINK_PROJECT = gql`
  mutation LinkProject($project: ID!, $study: ID!) {
    linkProject(project: $project, study: $study) {
      project {
        ...ProjectFields
      }
    }
  }
  ${PROJECT_FIELDS}
`;

// Mutation to unlink an exist analysis project
export const UNLINK_PROJECT = gql`
  mutation UnlinkProject($project: ID!, $study: ID!) {
    unlinkProject(project: $project, study: $study) {
      project {
        ...ProjectFields
      }
    }
  }
  ${PROJECT_FIELDS}
`;
