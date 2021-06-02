import gql from 'graphql-tag';

export const TOKEN_FIELDS = gql`
  fragment TokenFields on DevDownloadTokenNode {
    id
    name
    token
    createdAt
    creator {
      username
      picture
      displayName
    }
  }
`;

export const ORGANIZATION_FIELDS = gql`
  fragment OrganizationFields on OrganizationNode {
    id
    name
    description
    website
    email
    image
    createdOn
  }
`;
