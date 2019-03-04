import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {KF_STUDY_API} from '../common/globals';

const httpLink = createHttpLink({
  uri: `${KF_STUDY_API}/graphql`,
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('egoToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
