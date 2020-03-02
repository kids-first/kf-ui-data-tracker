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

it('renders research study info view correctly -- ADMIN user', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[13], mocks[56]]}
    >
      <MemoryRouter initialEntries={['/research-study/SD_8WX8QQ06/basic-info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait();
  expect(tree.container).toMatchSnapshot();

  await wait();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: ''},
    });
  });

  await wait();
  expect(tree.container).toMatchSnapshot();
  // Save button is disabled
  act(() => {
    fireEvent.click(tree.getByText(/SAVE/i));
  });

  expect(tree.queryByText(/Missing values/)).not.toBeNull();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  await wait();
  act(() => {
    fireEvent.change(tree.getByLabelText('shortName'), {
      target: {value: 'Test short name input on update'},
    });
  });

  act(() => {
    fireEvent.click(tree.getByText(/SAVE/i));
  });
  await wait(1500);
  expect(tree.container).toMatchSnapshot();
});

it('renders research study info view with get research study info error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[2], mocks[13], mocks[8]]}
    >
      <MemoryRouter initialEntries={['/research-study/SD_8WX8QQ06/basic-info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(/Network error: something went wrong/i),
  ).not.toBeNull();
});

it('renders research study info view with get user data error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[58]]}
    >
      <MemoryRouter initialEntries={['/research-study/SD_8WX8QQ06/basic-info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(/Failed to fetch users information/i),
  ).not.toBeNull();
});

it('renders research study info view with update research study info error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[13], mocks[57]]}
    >
      <MemoryRouter initialEntries={['/research-study/SD_8WX8QQ06/basic-info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/SAVE/i));
  });
  await wait(100);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to update the study/)).not.toBeNull();
});

it('renders research study info view with invalid study id', async () => {
  const tree_research = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter initialEntries={['/research-study/SD_INVALID/basic-info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree_research.container).toMatchSnapshot();
  expect(tree_research.queryAllByText(/Study not found/i)).not.toBeNull();
  expect(
    tree_research.queryAllByText(
      /Cannot find the research study with ID SD_INVALID/i,
    ),
  ).not.toBeNull();
});

it('renders research study info view as read-only -- USER user', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['BETA'];

  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[13]]}
    >
      <MemoryRouter initialEntries={['/research-study/SD_8WX8QQ06/basic-info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/SAVE/)).toBeNull();
});
