import gql from 'graphql-tag';
import {TOKEN_FIELDS, ORGANIZATION_FIELDS} from './fragments';

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

// Mutation to create banner
export const CREATE_BANNER = gql`
  mutation($input: BannerInput!) {
    createBanner(input: $input) {
      banner {
        id
        message
        severity
        enabled
        startDate
        endDate
        url
        urlLabel
      }
    }
  }
`;

// Mutation to update banner
export const UPDATE_BANNER = gql`
  mutation($id: ID!, $input: BannerInput!) {
    updateBanner(id: $id, input: $input) {
      banner {
        id
        message
        severity
        enabled
        startDate
        endDate
        url
        urlLabel
      }
    }
  }
`;

// Mutation to delete a banner
export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id) {
      id
      success
    }
  }
`;

// Mutation to update an organization
export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      organization {
        id
        ...OrganizationFields
      }
    }
  }
  ${ORGANIZATION_FIELDS}
`;
