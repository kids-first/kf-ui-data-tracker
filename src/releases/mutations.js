import gql from 'graphql-tag';
import {RELEASE_FIELDS, SERVICE_FIELDS} from './fragments';

export const START_RELEASE = gql`
  mutation StartRelease($input: ReleaseInput!) {
    startRelease(input: $input) {
      release {
        ...ReleaseFields
      }
    }
  }
  ${RELEASE_FIELDS}
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($taskService: ID!, $input: TaskServiceInput!) {
    updateTaskService(taskService: $taskService, input: $input) {
      taskService {
        ...ServiceFields
      }
    }
  }
  ${SERVICE_FIELDS}
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($input: TaskServiceInput!) {
    createTaskService(input: $input) {
      taskService {
        ...ServiceFields
      }
    }
  }
  ${SERVICE_FIELDS}
`;

export const UPDATE_RELEASE = gql`
  mutation UpdateRelease($input: UpdateReleaseInput!, $release: ID!) {
    updateRelease(release: $release, input: $input) {
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
        notes {
          edges {
            node {
              id
              description
            }
          }
        }
      }
    }
  }
  ${RELEASE_FIELDS}
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
        notes {
          edges {
            node {
              id
              description
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
        notes {
          edges {
            node {
              id
              description
            }
          }
        }
      }
    }
  }
  ${RELEASE_FIELDS}
`;
