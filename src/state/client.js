import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {createUploadLink} from 'apollo-upload-client';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {KF_STUDY_API} from '../common/globals';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('egoToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    authLink, 
    createUploadLink({ uri: `${KF_STUDY_API}/graphql` })
  ]),
});
