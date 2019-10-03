import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {
  Button,
  Confirm,
  Container,
  Dimmer,
  Header,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';

import {GET_DEV_TOKENS} from '../state/queries';
import {CREATE_DEV_TOKEN, DELETE_DEV_TOKEN} from '../state/mutations';
import {TokenList} from '../components/TokenList';
import NewTokenForm from '../forms/NewTokenForm';
import {AnalyticsViewConsumer} from '../analyticsTracking';

const TokensListView = ({
  devTokens: {allDevTokens, loading: devTokensLoading, error: devTokensError},
  createToken,
  deleteToken,
}) => {
  const [newTokenError, setNewTokenError] = useState();
  const [newTokenLoading, setNewTokenLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingToken, setDeletingToken] = useState();
  const [deleteTokenLoading, setDeleteTokenLoading] = useState(false);

  const handleNewToken = name => {
    setNewTokenLoading(true);
    createToken({variables: {name}})
      .then(resp => {
        setNewTokenLoading(false);
      })
      .catch(err => {
        setNewTokenError(err.message);
        setNewTokenLoading(false);
      });
  };

  // onClick event for the delete button next to a token item
  const handleDelete = name => {
    setDeletingToken(name);
    setConfirmOpen(true);
  };

  return (
    <AnalyticsViewConsumer>
      <Container as={Segment} basic>
        <Header as="h3">Manage Developer Download Tokens</Header>
        <Segment basic>
          Developer download tokens allow download of any file using the{' '}
          <code>?token=</code> query parameter or passed in the Authorization
          header with a <code>Token</code> prefix.
          {devTokensError ? (
            <Message
              negative
              icon="warning circle"
              header="Error"
              content={devTokensError}
            />
          ) : (
            <Message
              warning
              header="Keep these tokens private!"
              content="They will not be displayed again after being created."
            />
          )}
        </Segment>
        <Segment basic>
          {devTokensLoading && (
            <Segment basic padded="very">
              <Dimmer active inverted>
                <Loader inverted>Loading tokens...</Loader>
              </Dimmer>
            </Segment>
          )}
          {!devTokensLoading && allDevTokens && (
            <TokenList
              tokens={allDevTokens.edges}
              deleteToken={name => handleDelete(name)}
            />
          )}
          <Header as="h3">Make a new token</Header>
          <NewTokenForm
            error={newTokenError}
            loading={newTokenLoading}
            onSubmit={e => handleNewToken(e)}
          />
        </Segment>
      </Container>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setDeleteTokenLoading(true);
          deleteToken({variables: {name: deletingToken}})
            .then(resp => {
              setConfirmOpen(false);
              setDeleteTokenLoading(false);
            })
            .catch(err => {
              setConfirmOpen(false);
              setDeleteTokenLoading(false);
            });
        }}
        header={`Delete '${deletingToken}' token`}
        content="This will break any applications using this token. Are you sure?"
        confirmButton={
          <Button negative loading={deleteTokenLoading}>
            Delete
          </Button>
        }
      />
    </AnalyticsViewConsumer>
  );
};

export default compose(
  graphql(GET_DEV_TOKENS, {name: 'devTokens'}),
  graphql(DELETE_DEV_TOKEN, {
    name: 'deleteToken',
    options: {
      update: (cache, {data: {deleteDevToken}}) => {
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
      },
    },
  }),
  graphql(CREATE_DEV_TOKEN, {
    name: 'createToken',
    options: {
      update: (cache, {data: {createDevToken}}) => {
        // This will append the resulting token onto the list of dev tokens
        // The token that is appended will not be obfuscated so that the
        // user may copy it in plain text. The next time that it is fetched
        // from the server, it will be obfuscated.
        const {allDevTokens} = cache.readQuery({query: GET_DEV_TOKENS});
        const data = {
          allDevTokens: {
            ...allDevTokens,
            edges: allDevTokens.edges.concat([
              {
                node: createDevToken.token,
                __typename: 'DevDownloadTokenNodeEdge',
              },
            ]),
          },
        };
        cache.writeQuery({
          query: GET_DEV_TOKENS,
          data,
        });
      },
    },
  }),
)(TokensListView);
