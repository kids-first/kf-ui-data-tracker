import {ApolloClient, ApolloLink} from '@apollo/client';
import {InMemoryCache} from '@apollo/client/cache';
import {setContext} from '@apollo/client/link/context';
import {createUploadLink} from 'apollo-upload-client';
import {relayStylePagination} from '@apollo/client/utilities';
import {KF_STUDY_API} from '../common/globals';

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const studyLink = ApolloLink.from([
  authLink,
  createUploadLink({uri: `${KF_STUDY_API}/graphql`}),
]);

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allReleases: relayStylePagination(),
        },
      },
    },
  }),
  link: studyLink,
});
