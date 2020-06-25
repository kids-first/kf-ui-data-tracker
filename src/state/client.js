import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {createUploadLink} from 'apollo-upload-client';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from '@apollo/client/cache';
import {KF_STUDY_API, KF_COORD_API} from '../common/globals';

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

const coordLink = ApolloLink.from([
  authLink,
  createHttpLink({uri: `${KF_COORD_API}/graphql`}),
]);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.split(
    // See this article about multiple clients:
    // https://www.loudnoises.us/next-js-two-apollo-clients-two-graphql-data-sources-the-easy-way/
    operation => operation.getContext().clientName === 'coordinator',
    coordLink,
    studyLink,
  ),
});
