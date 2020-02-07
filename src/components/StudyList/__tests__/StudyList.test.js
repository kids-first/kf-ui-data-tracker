import React from 'react';
import wait from 'waait';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import {render, cleanup, fireEvent, act} from '@testing-library/react';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';
import StudyList from '../StudyList';

afterEach(cleanup);

it('renders study grid correctly', () => {
  const studies = allStudies.data.allStudies.edges;

  const tree = render(
    <MockedProvider
      resolvers={{
        UserNode: {
          ...myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter>
        <StudyList activeView="grid" studyList={studies} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  expect(cards.length).toBe(4);
});

it('renders study grid for ADMIN role', async () => {
  const studies = allStudies.data.allStudies.edges;
  const roles = myProfile.data.myProfile.roles;
  const tree = render(
    <MockedProvider
      resolvers={{
        UserNode: {
          ...myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter>
        <StudyList activeView="grid" studyList={studies} roles={roles} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on chevron button to show detail
  act(() => {
    fireEvent.click(tree.getAllByTestId('show-detail')[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on chevron button to hide detail
  act(() => {
    fireEvent.click(tree.getAllByTestId('hide-detail')[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('renders study grid loading state', () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        UserNode: {
          ...myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter>
        <StudyList activeView="grid" loading={true} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  // Should contain 4 cards in loading state
  expect(cards.length).toBe(4);
});

it('renders study grid/table empty state', () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        UserNode: {
          ...myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter>
        <StudyList activeView="grid" studyList={[]} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  expect(cards.length).toBe(0);
});
