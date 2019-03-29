import React from 'react';
import {Query, Mutation} from 'react-apollo';

import {GET_DEV_TOKENS} from '../state/queries';
import {DELETE_DEV_TOKEN} from '../state/mutations';
import {LoadingPlaceholder} from '../components/Loading';
import TokenList from '../components/Tokens/TokenList';
import NewTokenFormContainer from '../containers/NewTokenFormContainer';

const TokensListView = () => {
  // onClick event for the delete button next to a token item
  const onDelete = (callback, token) => {
    if (
      window.confirm(
        'This will break any applications using this token. Are you sure?',
      )
    ) {
      callback({variables: {token}});
    }
  };

  return (
    <div className="mx-12 pb-16 BodyContent">
      <h3 className="mt-0 pt-8 text-blue font-normal">
        Manage Developer Download Tokens
      </h3>
      <p>
        Developer download tokens allow download of any file using the ?token=
        query parameter.
      </p>
      <p>Keep these tokens private!</p>
      <section className="study-file-list">
        <Query query={GET_DEV_TOKENS}>
          {({loading, error, data}) => (
            <Mutation
              mutation={DELETE_DEV_TOKEN}
              refetchQueries={res => [
                {
                  query: GET_DEV_TOKENS,
                },
              ]}
            >
              {deleteToken => {
                if (loading)
                  return <LoadingPlaceholder componentName="File List" />;
                if (error) return `Error!: ${error}`;

                return (
                  <TokenList
                    tokens={data.allDevTokens.edges}
                    deleteToken={token => onDelete(deleteToken, token)}
                  />
                );
              }}
            </Mutation>
          )}
        </Query>

        <h3>Make a new token</h3>
        <NewTokenFormContainer />
      </section>
    </div>
  );
};

export default TokensListView;
