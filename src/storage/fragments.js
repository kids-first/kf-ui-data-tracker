import gql from 'graphql-tag';

export const BUCKET_FIELDS = gql`
  fragment BucketFields on BucketNode {
    id
    name
  }
`;
