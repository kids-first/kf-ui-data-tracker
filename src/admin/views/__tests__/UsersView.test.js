import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {
  allGroupsMock,
  allUsersMock,
  allUsersErrorMock,
  myProfileMock,
} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders admin users view correctly', async () => {
  const tree = render(
    <MockedProvider mocks={[allGroupsMock, myProfileMock, allUsersMock]}>
      <MemoryRouter initialEntries={['/users']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  tree.debug()
  expect(tree.container).toMatchSnapshot();
  const rows16 = tree.getAllByTestId('user-item');
  expect(rows16.length).toBe(16);

  // Click on the user role dropdown
  act(() => {
    fireEvent.click(tree.queryByText(/User Group/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the user role "ADMIN"
  act(() => {
    fireEvent.click(tree.queryAllByText(/Administrators/i)[1]);
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  const rows1 = tree.getAllByTestId('user-item');
  expect(rows1.length).toBe(1);

  // Click on the user role "BIX"
  act(() => {
    fireEvent.click(tree.getByLabelText(/group-filter/i));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.queryAllByText(/Bioinformatics/i)[0]);
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/No users data available/)).not.toBeNull();
});

it('renders admin users view with error message', async () => {
  const tree = render(
    <MockedProvider mocks={[allGroupsMock, allUsersErrorMock, myProfileMock]}>
      <MemoryRouter initialEntries={['/users']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.queryByText(/Failed to fetch users information/)).not.toBeNull();
});
