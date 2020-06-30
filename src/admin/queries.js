import gql from 'graphql-tag';
import {TOKEN_FIELDS} from './fragments';
import {STUDY_BASIC_FIELDS, CREATOR_FIELDS} from '../state/fragments';

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
