import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import {coordMocks} from '../../../../__mocks__/kf-api-release-coordinator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders study list correctly -- default stage', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[0], mocks[0], mocks[8], coordMocks.allReleaseStudies]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Research Studies/i));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByTestId('grid'));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  const cards4 = tree.container.querySelectorAll('.ui .card');
  expect(cards4.length).toBe(4);
  act(() => {
    fireEvent.change(tree.getByLabelText('studySearch'), {
      target: {value: 'benchmark'},
    });
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  const cards1 = tree.container.querySelectorAll('.ui .card');
  expect(cards1.length).toBe(1);
  act(() => {
    fireEvent.change(tree.getByLabelText('studySearch'), {
      target: {value: 'no mathcing'},
    });
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(
      /No Studies matching your search term. Try searching by Study Name/i,
    ),
  ).not.toBeNull();
});

it('renders study list correctly -- release error', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks.concat([coordMocks.allReleaseStudiesError])}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/research-studies']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(
      /Network error: Failed to fetch study releases information/i,
    ),
  ).not.toBeNull();
});

it('renders study list error and release error', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[49], mocks[8], coordMocks.allReleaseStudiesError]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/research-studies']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(/Network error: Failed to fetch study information/i),
  ).not.toBeNull();
  expect(
    tree.queryAllByText(
      /Network error: Failed to fetch study releases information/i,
    ),
  ).not.toBeNull();
});

it('renders empty study list with admin access', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[50], mocks[8], coordMocks.allReleaseStudies]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/research-studies']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(
      /Create the first study to initialize the Data Resource Center/i,
    ),
  ).not.toBeNull();
});

it('renders empty study list with no admin access', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['USER'];

  const tree = render(
    <MockedProvider
      mocks={[mocks[50], coordMocks.allReleaseStudies]}
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
    >
      <MemoryRouter initialEntries={['/research-studies']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryAllByText(
      /Your account is being reviewed for the proper permissions./i,
    ),
  ).not.toBeNull();
});
