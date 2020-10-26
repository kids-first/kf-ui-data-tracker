import gql from 'graphql-tag';
import {BUCKET_FIELDS} from './fragments';

export const START_RELEASE = gql`
  mutation StartRelease($input: ReleaseInput!) {
    startRelease(input: $input) {
      release {
        ...ReleaseFields
      }
    }
  }
  ${RELEASE_FIELDS}
`;
