import gql from 'graphql-tag';
import {BUCKET_FIELDS} from './fragments';

export const ALL_BUCKETS = gql`
  query AllBuckets {
    allBuckets {
      edges {
        node {
          ...BucketFields
          inventories(first: 1, orderBy: "-creation_date") {
            edges {
              node {
                id
                createdAt
                creationDate
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

export const GET_BUCKET = gql`
  query Bucket($id: ID!) {
    bucket(id: $id) {
      ...BucketFields
      inventories {
        edges {
          node {
            id
            createdAt
            creationDate
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
