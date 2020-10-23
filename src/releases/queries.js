import gql from 'graphql-tag';
import {RELEASE_FIELDS, SERVICE_FIELDS} from './fragments';

export const GET_RELEASES = gql`
  query AllReleases {
    allReleases(first: 20, orderBy: "-created_at") {
      edges {
        node {
          ...ReleaseFields
        }
      }
    }
  }
  ${RELEASE_FIELDS}
`;

export const LATEST_RELEASE = gql`
  query LatestRelease {
    allReleases(first: 1, orderBy: "-created_at", state: "published") {
      edges {
        node {
          ...ReleaseFields
        }
      }
    }
  }
  ${RELEASE_FIELDS}
`;

export const ALL_SERVICES = gql`
  query AllServices {
    allTaskServices(first: 20, orderBy: "-created_at") {
      edges {
        node {
          ...ServiceFields
        }
      }
    }
  }
  ${SERVICE_FIELDS}
`;

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    taskService(id: $id) {
      ...ServiceFields
    }
  }
  ${SERVICE_FIELDS}
`;

export const ALL_EVENTS = gql`
  query AllEvents($release: ID, $first: Int, $taskService: ID) {
    allEvents(
      release: $release
      taskService: $taskService
      orderBy: "-created_at"
      first: $first
    ) {
      edges {
        node {
          id
          createdAt
          message
          release {
            id
            kfId
            name
          }
          taskService {
            id
            kfId
            name
          }
          task {
            id
            kfId
          }
        }
      }
    }
  }
`;

export const ALL_TASKS = gql`
  query AllTasks($first: Int, $release: String) {
    allTasks(first: $first, release: $release) {
      edges {
        node {
          id
          kfId
          state
          createdAt
          taskService {
            id
            name
          }
        }
      }
    }
  }
`;

export const ALL_NOTES = gql`
  query AllNotes($release: ID) {
    allReleaseNotes(release: $release) {
      edges {
        node {
          id
          kfId
          description
          createdAt
          study {
            id
          }
        }
      }
    }
  }
`;

export const GET_RELEASE = gql`
  query GetRelease($id: ID!) {
    release(id: $id) {
      ...ReleaseFields
      studies {
        edges {
          node {
            id
            kfId
            name
            createdAt
          }
        }
      }
    }
  }
  ${RELEASE_FIELDS}
`;
