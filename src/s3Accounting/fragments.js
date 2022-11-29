import gql from 'graphql-tag';

export const FILE_AUDI_FIELDS = gql`
  fragment FileAudiFields on FileAuditNode {
    id
    result
    sourceFilename
    expectedUrl
    actualHash
    expectedHash
    expectedSize
    actualSize
    hashAlgorithm
    customFields
    createdAt
  }
`;
