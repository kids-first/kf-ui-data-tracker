import React from 'react';
import {Mutation} from 'react-apollo';

import {GET_DEV_TOKENS} from '../state/queries';
import {CREATE_DEV_TOKEN} from '../state/mutations';
import NewTokenForm from '../components/Tokens/NewTokenForm';

const NewTokenFormContainer = () => {
  const onSubmit = (e, createToken) => {
    e.preventDefault();
    createToken({variables: {name: e.target.name.value}});
  };

  return (
    <Mutation
      mutation={CREATE_DEV_TOKEN}
      update={(cache, {data: {createDevToken}}) => {
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
                __typename: 'DevDownloadTokenNodeEdge',
                node: createDevToken.token,
              },
            ]),
          },
        };
        cache.writeQuery({
          query: GET_DEV_TOKENS,
          data,
        });
      }}
    >
      {(createToken, {loading, error}) => (
        <NewTokenForm
          error={error}
          loading={loading}
          onSubmit={e => onSubmit(e, createToken)}
        />
      )}
    </Mutation>
  );
};

export default NewTokenFormContainer;
