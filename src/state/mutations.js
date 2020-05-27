import gql from 'graphql-tag';
import {
  PROJECT_FIELDS,
  STUDY_BASIC_FIELDS,
  STUDY_INFO_FIELDS,
  USER_FIELDS,
} from './fragments';

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
  mutation CREATE_STUDY($input: CreateStudyInput!, $workflows: [String]) {
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
  mutation CreateProject(
    $workflowType: String
    $projectType: ProjectType
    $study: ID!
  ) {
    createProject(
      input: {
        workflowType: $workflowType
        projectType: $projectType
        study: $study
      }
    ) {
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

// Mutation to import files from a volume to a project
export const IMPORT_VOLUME_FILES = gql`
  mutation ImportVolumeFiles($project: ID!) {
    importVolumeFiles(project: $project) {
      project {
        ...ProjectFields
      }
    }
  }
  ${PROJECT_FIELDS}
`;

// Mutation to add collaborator to a study
export const ADD_COLLABORATOR = gql`
  mutation addCollaborator($study: ID!, $user: ID!) {
    addCollaborator(study: $study, user: $user) {
      study {
        ...StudyBasicFields
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
`;

// Mutation to remove collaborator to a study
export const REMOVE_COLLABORATOR = gql`
  mutation removeCollaborator($study: ID!, $user: ID!) {
    removeCollaborator(study: $study, user: $user) {
      study {
        ...StudyBasicFields
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
`;

export const UPDATE_USER = gql`
  mutation updateUser($user: ID!, $groups: [ID]) {
    updateUser(user: $user, groups: $groups) {
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const CHANGE_SEQUENCING_STATUS = gql`
  mutation updateSequencingStatus(
    $study: ID!
    $data: UpdateSequencingStatusInput!
  ) {
    updateSequencingStatus(study: $study, data: $data) {
      study {
        id
        ...StudyInfoFields
      }
    }
  }
  ${STUDY_INFO_FIELDS}
`;

export const CHANGE_INGESTION_STATUS = gql`
  mutation updateIngestionStatus(
    $study: ID!
    $data: UpdateIngestionStatusInput!
  ) {
    updateIngestionStatus(study: $study, data: $data) {
      study {
        id
        ...StudyInfoFields
      }
    }
  }
  ${STUDY_INFO_FIELDS}
`;

export const CHANGE_PHENOTYPE_STATUS = gql`
  mutation updatePhenotypeStatus(
    $study: ID!
    $data: UpdatePhenotypeStatusInput!
  ) {
    updatePhenotypeStatus(study: $study, data: $data) {
      study {
        id
        ...StudyInfoFields
      }
    }
  }
  ${STUDY_INFO_FIELDS}
`;

export const CREATE_REFERRAL_TOKEN = gql`
  mutation createReferralToken($input: ReferralTokenInput!) {
    createReferralToken(input: $input) {
      referralToken {
        id
        uuid
        email
        claimed
        createdAt
        isValid
        groups {
          edges {
            node {
              id
            }
          }
        }
        studies {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export const EXCHANGE_REFERRAL_TOKEN = gql`
  mutation exchangeReferralToken($token: ID!) {
    exchangeReferralToken(token: $token) {
      user {
        email
        studies {
          edges {
            node {
              id
            }
          }
        }
        groups {
          edges {
            node {
              id
            }
          }
        }
      }

      referralToken {
        studies {
          edges {
            node {
              ...StudyBasicFields
              ...StudyInfoFields
              collaborators {
                edges {
                  node {
                    ...UserFields
                  }
                }
              }
              projects {
                edges {
                  node {
                    ...ProjectFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
  ${STUDY_INFO_FIELDS}
  ${USER_FIELDS}
  ${PROJECT_FIELDS}
`;
