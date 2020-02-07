import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');

it('renders token list correctly - displaying look & hidden look', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[
        mocks[8],
        mocks[9],
        mocks[10],
        mocks[9],
        mocks[35],
        mocks[9],
        mocks[34],
        mocks[9],
      ]}
    >
      <MemoryRouter initialEntries={['/tokens']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
    {
      container: document.body,
    },
  );

  expect(tree.container).toMatchSnapshot();

  await wait();

  // Update create new token -- success
  const nameInput = tree.getByTestId('token-name-input');
  act(() => {
    fireEvent.change(nameInput, {target: {value: 'my token 4'}});
  });
  act(() => {
    fireEvent.click(tree.getAllByTestId('token-create')[0]);
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();

  // Update create new token -- with error
  const nameInputE = tree.getByTestId('token-name-input');
  act(() => {
    fireEvent.change(nameInputE, {target: {value: 'my token 4'}});
  });
  act(() => {
    fireEvent.click(tree.getAllByTestId('token-create')[0]);
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to create new token/)).not.toBeNull();

  // Click on the delete token button
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-token-button')[0]);
  });

  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Cancel/i));
  });

  await wait();

  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-token-button')[0]);
  });

  await wait();

  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-token-confirm')[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('renders token list -- with get error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[8], mocks[36]]}
    >
      <MemoryRouter initialEntries={['/tokens']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to fetch tokens information/)).not.toBeNull();
});
