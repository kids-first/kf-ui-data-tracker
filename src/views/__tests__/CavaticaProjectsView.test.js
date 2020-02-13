import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders Cavatica projects view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[18], mocks[18], mocks[19], mocks[8]]}
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

  act(() => {
    fireEvent.click(tree.queryAllByText(/Click to Expand/i)[0]);
  });

  expect(tree.container).toMatchSnapshot();

  // Click to sync projects
  act(() => {
    fireEvent.click(tree.queryAllByText(/Scan Cavatica/i)[0]);
  });
  expect(tree.container).toMatchSnapshot();
  await wait(1000);
  expect(tree.container).toMatchSnapshot();

  // Click to open the edit project modal
  act(() => {
    fireEvent.click(tree.queryAllByText(/EDIT/i)[0]);
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
      mocks={[mocks[18], mocks[8]]}
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
    fireEvent.click(tree.queryAllByText(/Scan Cavatica/i)[0]);
  });
  await wait(1000);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText('Network error: Failed to sync Cavatica projects'),
  ).not.toBeNull();
});

it('renders Cavatica projects view correctly -- with get error', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[17], mocks[33], mocks[8]]}
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
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/Failed to fetch projects information/),
  ).not.toBeNull();
});
