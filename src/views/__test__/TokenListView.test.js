import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
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
      mocks={[mocks[8], mocks[9], mocks[10]]}
    >
      <MemoryRouter initialEntries={['/tokens']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(0);

  // Update file name
  const nameInput = tree.getByTestId('token-name-input');
  act(() => {
    fireEvent.change(nameInput, {target: {value: 'my token 4'}});
  });
  act(() => {
    fireEvent.click(tree.getByText(/Create/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the delete token button
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-token-button')[0]);
  });
});
