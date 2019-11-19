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

it('renders study Cavatica projects view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();

  // Click to open the create new project modal
  act(() => {
    fireEvent.click(tree.getByText(/New Project/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Select a workflow type/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/star_2_pass/i));
  });

  // Click to open the link project modal
  act(() => {
    fireEvent.click(tree.getByText(/Link Project/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Choose a project/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click to open the edit project modal
  act(() => {
    fireEvent.click(tree.getByText(/EDIT/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('renders study Cavatica projects view -- shows an error', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[16], mocks[1], mocks[8]]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Error')).not.toBeNull();
});

it('renders study Cavatica projects view -- empty view for regular user', async () => {
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
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
});
