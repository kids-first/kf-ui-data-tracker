import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render, cleanup} from 'react-testing-library';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';
import StudyList from '../StudyList';

afterEach(cleanup);

it('renders correctly', () => {
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
        <StudyList studyList={studies} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  expect(cards.length).toBe(4);
});

it('renders loading state', () => {
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
        <StudyList loading={true} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  // Should contain 4 cards in loading state
  expect(cards.length).toBe(4);
});

it('renders empty state', () => {
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
        <StudyList studyList={[]} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  expect(cards.length).toBe(0);
});
