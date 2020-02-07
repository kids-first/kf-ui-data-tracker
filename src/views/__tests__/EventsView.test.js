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
      <MemoryRouter initialEntries={['/events']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();

  // Click on the user dropdown
  act(() => {
    fireEvent.click(tree.queryAllByText(/User/i)[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the user "Justin Heath"
  act(() => {
    fireEvent.click(tree.queryAllByText(/Justin Heath/i)[0]);
  });

  await wait(100);

  expect(tree.container).toMatchSnapshot();

  // Click on the study dropdown
  act(() => {
    fireEvent.click(tree.queryAllByText(/Study/i)[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the study "strategize cross-media markets"
  act(() => {
    fireEvent.click(tree.getByText(/strategize cross-media markets/i));
  });

  await wait();

  // Click on the event type dropdown
  act(() => {
    fireEvent.click(tree.getByText(/Event Type/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the event type "File Version Created"
  act(() => {
    fireEvent.click(tree.getByText(/File Version Created/i));
  });

  await wait(100);

  expect(tree.container).toMatchSnapshot();
});

it('renders admin event logs view with error message', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[31], mocks[8], mocks[13], mocks[0]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/events']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to fetch events information/)).not.toBeNull();
});

it('renders admin event logs first 20, click to show more', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[0], mocks[8], mocks[13], mocks[45], mocks[46]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/events']}>
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
