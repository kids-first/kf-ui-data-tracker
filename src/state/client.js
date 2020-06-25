import {ApolloClient, HttpLink} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';
import {InMemoryCache} from '@apollo/client/cache';
import {KF_STUDY_API, KF_COORD_API} from '../common/globals';

const link = new HttpLink.split(
  operation => operation.getContext().clientName === 'coordinator',
  new HttpLink({uri: `${KF_COORD_API}/graphql`}),
  new createUploadLink({uri: `${KF_STUDY_API}/graphql`}),
);

const policies = {
  typePolicies: {
    StudyNode: {
      fields: {
        kfId: {
          merge(existing, incoming) {
            console.log('merging');
            // Better, but not quite correct.
            return {...existing, ...incoming};
          },
        },
      },
    },
  },
};

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('accessToken')
      ? `Bearer ${localStorage.getItem('accessToken')}`
      : '',
  },
  link,
});
