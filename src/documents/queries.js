import gql from 'graphql-tag';
import {FILE_FIELDS, VERSION_FIELDS} from './fragments';
import {CREATOR_FIELDS} from '../state/fragments';

// Query to get a file by its kf id
export const GET_FILE_BY_ID = gql`
  query File($kfId: String!) {
    fileByKfId(kfId: $kfId) {
      ...FileFields
      creator {
        ...CreatorFields
      }
      versions {
        edges {
          node {
            ...VersionFields
            downloadUrl
            creator {
              ...CreatorFields
            }
          }
        }
      }
    }
  }
  ${FILE_FIELDS}
  ${VERSION_FIELDS}
  ${CREATOR_FIELDS}
`;
