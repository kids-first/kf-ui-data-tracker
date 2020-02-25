import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders admin event logs view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/users']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
  await wait();
  expect(tree.container).toMatchSnapshot();
  const rows20 = tree.getAllByTestId('user-item');
  expect(rows20.length).toBe(20);

  // Click on the user role dropdown
  act(() => {
    fireEvent.click(tree.queryByText(/User Role/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the user role "ADMIN"
  act(() => {
    fireEvent.click(tree.queryAllByText(/Admin/i)[2]);
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  const rows1 = tree.getAllByTestId('user-item');
  expect(rows1.length).toBe(1);

  // Click on the user role "BIX"
  act(() => {
    fireEvent.click(tree.queryAllByText(/Admin/i)[1]);
  });
  await wait();
  act(() => {
    fireEvent.click(tree.queryByText(/Bix/i));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/No users data available/)).not.toBeNull();
});

it('renders admin users view with error message', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[58], mocks[8]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/users']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to fetch users information/)).not.toBeNull();
});
