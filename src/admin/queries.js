import gql from 'graphql-tag';
import {TOKEN_FIELDS, ORGANIZATION_FIELDS} from './fragments';
import {
  STUDY_BASIC_FIELDS,
  CREATOR_FIELDS,
  USER_FIELDS,
  GROUP_FIELDS,
} from '../state/fragments';

// Query to get developer tokens
export const GET_DEV_TOKENS = gql`
  query DevTokens {
    allDevTokens {
      edges {
        node {
          ...TokenFields
        }
      }
    }
  }
  ${TOKEN_FIELDS}
`;

// Get all buckets
export const GET_BUCKETS = gql`
  query Buckets {
    allBuckets {
      edges {
        node {
          id
          name
          deleted
          createdOn
          study {
            ...StudyBasicFields
          }
        }
      }
    }
  }
  ${STUDY_BASIC_FIELDS}
`;

// All pending invites
export const ALL_REFERRAL_TOEKNS = gql`
  query allReferralTokens {
    allReferralTokens {
      edges {
        node {
          id
          email
          claimed
          isValid
          createdAt
          createdBy {
            ...CreatorFields
          }
          claimedBy {
            dateJoined
            ...CreatorFields
          }
          studies {
            edges {
              node {
                ...StudyBasicFields
              }
            }
          }
          groups {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
  ${CREATOR_FIELDS}
  ${STUDY_BASIC_FIELDS}
`;

// Get all users with their groups
export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      edges {
        node {
          id
          ...UserFields
          ...GroupFields
        }
      }
    }
  }
  ${USER_FIELDS}
  ${GROUP_FIELDS}
`;

export const ALL_LOGS = gql`
  query AllLogs($job: ID) {
    allJobLogs(orderBy: "-created_at", job: $job, first: 20) {
      edges {
        node {
          id
          createdAt
          downloadUrl
          error
          job {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_LOG = gql`
  query Log($id: ID!) {
    jobLog(id: $id) {
      id
      createdAt
      downloadUrl
      error
      job {
        id
        name
      }
    }
  }
`;

export const ALL_JOBS = gql`
  query Jobs {
    allJobs(orderBy: "name") {
      edges {
        node {
          id
          name
          failing
          active
          scheduled
          enqueuedAt
        }
      }
    }
  }
`;

// Get all banners
export const ALL_BANNERS = gql`
  query Banners($enabled: Boolean) {
    allBanners(enabled: $enabled) {
      edges {
        node {
          id
          message
          enabled
          severity
          startDate
          endDate
          url
          urlLabel
          creator {
            ...CreatorFields
          }
        }
      }
    }
  }
  ${CREATOR_FIELDS}
`;

// Get a banner
export const GET_BANNER = gql`
  query($id: ID!) {
    banner(id: $id) {
      id
      message
      enabled
      severity
      startDate
      endDate
      url
      urlLabel
      creator {
        ...CreatorFields
      }
    }
  }
  ${CREATOR_FIELDS}
`;

// Get all organizatinos
export const ALL_ORGANIZATIONS = gql`
  query Organizations {
    allOrganizations {
      edges {
        node {
          ...OrganizationFields
        }
      }
    }
  }
  ${ORGANIZATION_FIELDS}
`;
