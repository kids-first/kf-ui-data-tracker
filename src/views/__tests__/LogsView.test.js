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

it('renders study logs view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[11], mocks[37], mocks[1], mocks[8]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/logs']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();

  // Click on the event type dropdown
  act(() => {
    fireEvent.click(tree.getByText(/Event Type/i));
  });
  await wait();

  // Click on the event type "File Version Created"
  act(() => {
    fireEvent.click(tree.getByText(/File Version Created/i));
  });

  await wait(100);

  expect(tree.container).toMatchSnapshot();
});

it('renders study event logs first 20, click to show more', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[1], mocks[8], mocks[47], mocks[48]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/logs']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  const rows20 = tree.getAllByTestId('event-item');
  expect(rows20.length).toBe(20);

  // Click on the More button to load 20 more events
  act(() => {
    fireEvent.click(tree.getByText(/More/i));
  });
  await wait(100);
  expect(tree.container).toMatchSnapshot();
  const rows40 = tree.getAllByTestId('event-item');
  expect(rows40.length).toBe(40);
});

it('renders study logs view correctly --  showing empty view for non-admin user', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['USER'];
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/logs']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(2000);
  expect(tree.container).toMatchSnapshot();
});

it('renders study logs view -- shows an error', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[12], mocks[2], mocks[8]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/logs']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText('Error')).not.toBeNull();
});
