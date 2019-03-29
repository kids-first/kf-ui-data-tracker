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
      refetchQueries={res => [
        {
          query: GET_DEV_TOKENS,
        },
      ]}
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
