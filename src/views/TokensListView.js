import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
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

const TokensListView = () => {
  const {data, loading: devTokensLoading, error: devTokensError} = useQuery(
    GET_DEV_TOKENS,
  );
  const allDevTokens = data && data.allDevTokens;
  const [createToken] = useMutation(CREATE_DEV_TOKEN, {
    refetchQueries: [{query: GET_DEV_TOKENS}],
  });
  const [deleteToken] = useMutation(DELETE_DEV_TOKEN, {
    refetchQueries: [{query: GET_DEV_TOKENS}],
  });

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
    <>
      <Helmet>
        <title>KF Data Tracker - Developer tokens</title>
      </Helmet>
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
              content={devTokensError.message}
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
          deleteToken({variables: {name: deletingToken}});
          setConfirmOpen(false);
          setDeleteTokenLoading(false);
        }}
        header={`Delete '${deletingToken}' token`}
        content="This will break any applications using this token. Are you sure?"
        confirmButton={
          <Button
            negative
            loading={deleteTokenLoading}
            data-testid="delete-token-confirm"
          >
            Delete
          </Button>
        }
      />
    </>
  );
};

export default TokensListView;
