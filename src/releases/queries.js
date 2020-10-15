import gql from 'graphql-tag';
import {RELEASE_FIELDS, SERVICE_FIELDS} from './fragments';

export const GET_RELEASES = gql`
  query AllReleases {
    allReleases(first: 5, orderBy: "-created_at") {
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

