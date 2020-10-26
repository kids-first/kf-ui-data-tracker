import gql from 'graphql-tag';
import {BUCKET_FIELDS} from './fragments';

export const GET_BUCKETS = gql`
  query AllBuckets {
    allBuckets(first: 20) {
      edges {
        node {
          ...BucketFields
        }
      }
    }
  }
  ${BUCKET_FIELDS}
`;
