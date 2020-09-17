import gql from 'graphql-tag';
import {TOKEN_FIELDS} from './fragments';
import {USER_FIELDS} from '../state/fragments';

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

export const CREATE_VALIDATION = gql`
  mutation CreateValidation($versions: [ID]!) {
    createValidation(versions: $versions) {
      validation {
        id
        createdAt
        result
        creator {
          ...UserFields
        }
        versions {
          edges {
            node {
              id
              kfId
              fileName
            }
          }
        }
      }
    }
  }
  ${USER_FIELDS}
`;
