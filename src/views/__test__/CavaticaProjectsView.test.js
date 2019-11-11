import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders Cavatica projects view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[17], mocks[18], mocks[19], mocks[8]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/cavatica-projects']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click to sync projects
  act(() => {
    fireEvent.click(tree.getByText(/Scan Cavatica/i));
  });
  expect(tree.container).toMatchSnapshot();
  await wait(1000);
  expect(tree.container).toMatchSnapshot();

  // Click to open the edit project modal
  act(() => {
    fireEvent.click(tree.getByText(/EDIT/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders Cavatica projects view -- empty view for regular user', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['USER'];

  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
      mocks={[mocks[17], mocks[8]]}
    >
      <MemoryRouter initialEntries={['/cavatica-projects']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
});

it('renders Cavatica projects view correctly -- with sync error', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[17], mocks[18], mocks[20], mocks[8]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/cavatica-projects']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  // Click to sync projects
  act(() => {
    fireEvent.click(tree.getByText(/Scan Cavatica/i));
  });
  await wait(1000);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText('Network error: Failed to sync Cavatica projects'),
  ).not.toBeNull();
});