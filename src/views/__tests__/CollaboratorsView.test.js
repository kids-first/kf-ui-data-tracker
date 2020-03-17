import React from 'react';
import wait from 'waait';
import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {GraphQLError} from 'graphql';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../../state/queries';
import {ADD_COLLABORATOR} from '../../state/mutations';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import addCollaborator from '../../../__mocks__/kf-api-study-creator/responses/addCollaborator.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

const studyErrorMock = {
  request: {
    query: GET_STUDY_BY_ID,
    variables: {
      kfId: 'SD_8WX8QQ06',
    },
  },
  error: new Error('Failed to get study'),
};

const noStudyMock = {
  request: {
    query: GET_STUDY_BY_ID,
    variables: {
      kfId: 'SD_00000000',
    },
  },
  result: {data: {studyByKfId: null}},
};

const userProfileMock = {
  request: {
    query: MY_PROFILE,
  },
  result: myProfile,
};

const addCollaboratorMock = {
  request: {
    query: ADD_COLLABORATOR,
    variables: {
      study: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
      user: 'VXNlck5vZGU6MQ==',
    },
  },
  result: addCollaborator,
};

const addCollaboratorErrorMock = {
  request: {
    query: ADD_COLLABORATOR,
    variables: {
      study: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
      user: 'VXNlck5vZGU6MQ==',
    },
  },
  result: {errors: [new GraphQLError('Could not add collaborator')]},
};

it('Renders collaborators view correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Renders error screen correctly', async () => {
  const tree = render(
    <MockedProvider mocks={[studyErrorMock, userProfileMock]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Renders not found screen correctly', async () => {
  const tree = render(
    <MockedProvider mocks={[noStudyMock, noStudyMock, userProfileMock]}>
      <MemoryRouter initialEntries={['/study/SD_00000000/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Renders add collaborator modal', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/ADD COLLABORATOR/i));
  });

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Cancel/i));
  });

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/ADD COLLABORATOR/i));
  });

  act(() => {
    fireEvent.click(tree.container.querySelector('i'));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Renders remove collaborator popup', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  act(() => {
    fireEvent.click(tree.getAllByTestId('remove-button')[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Adds collaborator error', async () => {
  const tree = render(
    <MockedProvider mocks={[...mocks, addCollaboratorErrorMock]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/ADD COLLABORATOR/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Choose a user/i));
  });

  act(() => {
    fireEvent.click(tree.getByText(/Roger Swanson/i));
  });

  act(() => {
    fireEvent.click(tree.getByTestId('add-button'));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Adds collaborator', async () => {
  const tree = render(
    <MockedProvider mocks={[...mocks, addCollaboratorMock]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/collaborators']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/ADD COLLABORATOR/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Choose a user/i));
  });

  act(() => {
    fireEvent.click(tree.getByText(/Roger Swanson/i));
  });

  act(() => {
    fireEvent.click(tree.getByTestId('add-button'));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});
