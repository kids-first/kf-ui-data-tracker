import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {createUploadLink} from 'apollo-upload-client';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
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
  cache: new InMemoryCache(),
  link: studyLink,
});
