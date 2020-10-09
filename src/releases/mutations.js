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

