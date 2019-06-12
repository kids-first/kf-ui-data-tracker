import React from 'react';
import {Query, Mutation} from 'react-apollo';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';

import {GET_DEV_TOKENS} from '../state/queries';
import {DELETE_DEV_TOKEN} from '../state/mutations';
import {LoadingPlaceholder} from '../components/Loading';
import TokenList from '../components/Tokens/TokenList';
import NewTokenFormContainer from '../containers/NewTokenFormContainer';

const TokensListView = () => {
  // onClick event for the delete button next to a token item
  const onDelete = (callback, name) => {
    if (
      window.confirm(
        'This will break any applications using this token. Are you sure?',
      )
    ) {
      callback({variables: {name}});
    }
  };

  return (
    <Container>
      <Header as="h3">Manage Developer Download Tokens</Header>
      <Segment basic>
        Developer download tokens allow download of any file using the{' '}
        <code>?token=</code> query parameter or passed in the Authorization
        header with a <code>Token</code> prefix.
        <Message
          warning
          header="Keep these tokens private!"
          content="They will not be displayed again after being created."
        />
      </Segment>
      <Segment basic>
        <Query query={GET_DEV_TOKENS}>
          {({loading, error, data}) => (
            <Mutation
              mutation={DELETE_DEV_TOKEN}
              update={(cache, {data: {deleteDevToken}}) => {
                // Removes the token from the allDevTokens query in the cache
                const {allDevTokens} = cache.readQuery({query: GET_DEV_TOKENS});
                const deleteIndex = allDevTokens.edges.findIndex(
                  edge => edge.node.name === deleteDevToken.name,
                );
                if (deleteIndex < 0) {
                  return allDevTokens;
                }
                allDevTokens.edges.splice(deleteIndex, 1);
                const data = {
                  allDevTokens: {
                    ...allDevTokens,
                    edges: allDevTokens.edges,
                  },
                };
                cache.writeQuery({
                  query: GET_DEV_TOKENS,
                  data,
                });
              }}
            >
              {deleteToken => {
                if (loading)
                  return (
                    <Segment basic style={{minHeight: '100px'}}>
                      <Dimmer active inverted>
                        <Loader inverted>Loading tokens...</Loader>
                      </Dimmer>
                    </Segment>
                  );
                if (error) return `Error!: ${error}`;

                return (
                  <TokenList
                    tokens={data.allDevTokens.edges}
                    deleteToken={name => onDelete(deleteToken, name)}
                  />
                );
              }}
            </Mutation>
          )}
        </Query>

        <Header as="h3">Make a new token</Header>
        <NewTokenFormContainer />
      </Segment>
    </Container>
  );
};

export default TokensListView;
