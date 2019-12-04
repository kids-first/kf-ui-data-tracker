import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders study info view correctly -- ADMIN user', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[23]]}
    >
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/basic-info/logistics']}
      >
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/SAVE/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.change(tree.getByLabelText('anticipatedSamples'), {
      target: {value: '-1'},
    });
  });

  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/External/i));
  });

  await wait();

  act(() => {
    fireEvent.change(tree.getByLabelText('version'), {
      target: {value: 'more-than-ten-characters'},
    });
  });

  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Info/i));
  });

  await wait();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: ''},
    });
  });

  await wait();

  expect(tree.container).toMatchSnapshot();
}, 10000);

it('renders study info view with get study info error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[2], mocks[8]]}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/basic-info/external']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/Network error: something went wrong/i),
  ).not.toBeNull();
});

it('renders study info view with update study info error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[24]]}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/basic-info/external']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/SAVE/i));
  });

  await wait(1000);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to update the study/)).not.toBeNull();
});

it('renders study info view as read-only -- USER user', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['BETA'];

  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
      mocks={[mocks[1], mocks[8]]}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/basic-info/info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/Logistics/i));
  });

  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/PREVIOUS/i));
  });

  await wait();

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/SAVE/)).toBeNull();
});
