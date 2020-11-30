import gql from 'graphql-tag';
import {RELEASE_FIELDS, SERVICE_FIELDS} from './fragments';

export const START_RELEASE = gql`
  mutation StartRelease($input: StartReleaseInput!) {
    startRelease(input: $input) {
      release {
        ...ReleaseFields
      }
    }
  }
  ${RELEASE_FIELDS}
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateReleaseServiceInput!) {
    updateReleaseService(id: $id, input: $input) {
      releaseService {
        ...ServiceFields
      }
    }
  }
  ${SERVICE_FIELDS}
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateReleaseServiceInput!) {
    createReleaseService(input: $input) {
      releaseService {
        ...ServiceFields
      }
    }
  }
  ${SERVICE_FIELDS}
`;

export const UPDATE_RELEASE = gql`
  mutation UpdateRelease($input: UpdateReleaseInput!, $id: ID!) {
    updateRelease(id: $id, input: $input) {
      release {
        ...ReleaseFields
        studies {
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
  ${RELEASE_FIELDS}
`;

export const CREATE_RELEASE_NOTE = gql`
  mutation CreateReleaseNote($input: ReleaseNoteInput!) {
    createReleaseNote(input: $input) {
      releaseNote {
        id
      }
    }
  }
`;

export const UPDATE_RELEASE_NOTE = gql`
  mutation UpdateReleaseNote(
    $input: UpdateReleaseNoteInput!
    $releaseNote: ID!
  ) {
    updateReleaseNote(input: $input, releaseNote: $releaseNote) {
      releaseNote {
        id
      }
    }
  }
`;

export const REMOVE_RELEASE_NOTE = gql`
  mutation RemoveReleaseNote($releaseNote: ID!) {
    removeReleaseNote(releaseNote: $releaseNote) {
      success
    }
  }
`;

export const PUBLISH_RELEASE = gql`
  mutation PublishRelease($release: ID!) {
    publishRelease(release: $release) {
      release {
        ...ReleaseFields
        studies {
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
  ${RELEASE_FIELDS}
`;

export const CANCEL_RELEASE = gql`
  mutation CancelRelease($release: ID!) {
    cancelRelease(release: $release) {
      release {
        ...ReleaseFields
        studies {
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
  ${RELEASE_FIELDS}
`;
