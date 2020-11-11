import gql from 'graphql-tag';
import {BUCKET_FIELDS} from './fragments';

export const ALL_BUCKETS = gql`
  query AllBuckets {
    allBuckets(first: 20) {
      edges {
        node {
          ...BucketFields
          inventories {
            edges {
              node {
                id
                totalBytes
                createdAt
                summary
              }
            }
          }
          study {
            id
            kfId
            shortName
          }
        }
      }
    }
  }
  ${BUCKET_FIELDS}
`;

export const BUCKET_LINES = gql`
  query BucketSize {
    bucketSize {
      date
      size
    }
  }
`;

export const INVENTORY_STATS = gql`
  query InventoryStats {
    bucketInventoryStats {
      totalBytes
      totalObjects
      totalBuckets
      countByFileFormat {
        fileFormat
        value
      }
      sizeByFileFormat {
        fileFormat
        value
      }
    }
  }
`;
