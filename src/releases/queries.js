import {RELEASE_FIELDS, SERVICE_FIELDS} from './fragments';

import gql from 'graphql-tag';

export const GET_RELEASES = gql`
  query AllReleases(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $state: String
  ) {
    allReleases(
      first: $first
      last: $last
      after: $after
      before: $before
      orderBy: "-created_at"
      state: $state
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...ReleaseFields
          tasks {
            edges {
              node {
                releaseService {
                  ...ServiceFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${RELEASE_FIELDS}
  ${SERVICE_FIELDS}
`;

// A pared down releases query to fetch only minimal information
export const BASIC_RELEASES = gql`
  query BasicReleases {
    allReleases(orderBy: "-created_at") {
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
  query AllServices($enabled: Boolean) {
    allReleaseServices(first: 20, enabled: $enabled, orderBy: "-created_at") {
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
    releaseService(id: $id) {
      ...ServiceFields
    }
  }
  ${SERVICE_FIELDS}
`;

export const ALL_EVENTS = gql`
  query AllEvents($release: ID, $first: Int, $releaseService: ID) {
    allReleaseEvents(
      release: $release
      releaseService: $releaseService
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
          releaseService {
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
  query AllTasks($first: Int, $release: ID!) {
    allReleaseTasks(first: $first, release: $release) {
      edges {
        node {
          id
          kfId
          state
          createdAt
          releaseService {
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
      tasks {
        edges {
          node {
            id
            kfId
            state
            jobLog {
              id
              downloadUrl
            }
            releaseService {
              ...ServiceFields
            }
          }
        }
      }
    }
  }
  ${RELEASE_FIELDS}
  ${SERVICE_FIELDS}
`;
