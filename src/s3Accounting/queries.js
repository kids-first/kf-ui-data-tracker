import {FILE_AUDI_FIELDS} from './fragments';
import gql from 'graphql-tag';

export const ALL_STORAGE_ANALYSES = gql`
  query allStorageAnalyses($studyKfId: String) {
    allStorageAnalyses(studyKfId: $studyKfId) {
      edges {
        node {
          id
          uuid
          createdAt
          refreshedAt
          scannedStorageAt
          stats
          study {
            id
            kfId
            name
          }
          fileAudits {
            edges {
              node {
                ...FileAudiFields
              }
            }
          }
        }
      }
    }
  }
  ${FILE_AUDI_FIELDS}
`;

export const ALL_FILE_AUDITS = gql`
  query allFileAudits(
    $storageAnalysis: ID
    $result: ResultEnum
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    allFileAudits(
      storageAnalysis: $storageAnalysis
      result: $result
      first: $first
      last: $last
      after: $after
      before: $before
      orderBy: "-created_at"
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...FileAudiFields
        }
      }
    }
  }
  ${FILE_AUDI_FIELDS}
`;

export const ALL_CLOUD_INVENTORY_FILES = gql`
  query allCloudInventoryFiles($storageAnalysis: ID, $result: ResultEnum) {
    allCloudInventoryFiles(storageAnalysis: $storageAnalysis, result: $result) {
      edges {
        node {
          ...FileAudiFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${FILE_AUDI_FIELDS}
`;

export const ALL_UPLOAD_MANIFEST_FILES = gql`
  query allUploadManifestFiles($storageAnalysis: ID, $result: ResultEnum) {
    allUploadManifestFiles(storageAnalysis: $storageAnalysis, result: $result) {
      edges {
        node {
          ...FileAudiFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${FILE_AUDI_FIELDS}
`;
