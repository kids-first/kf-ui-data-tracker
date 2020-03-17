import React from 'react';
import {render, act, fireEvent} from '@testing-library/react';
import {CollaboratorsList} from '../';

jest.mock('auth0-js');

const users = [
  {
    node: {
      id: 'VXNlck5vZGU6OQ==',
      username: 'Anthony Hamilton',
      firstName: 'John',
      lastName: 'Garza',
      email: 'richard06@merritt.net',
      picture: '',
      roles: [],
      __typename: 'UserNode',
    },
    __typename: 'UserNodeEdge',
  },
  {
    node: {
      id: 'VXNlck5vZGU6MjY=',
      username: 'devadmin',
      firstName: '',
      lastName: '',
      email: 'admin@myproject.com',
      picture: '',
      roles: ['ADMIN'],
      __typename: 'UserNode',
    },
    __typename: 'UserNodeEdge',
  },
];

it('Renders collaborators list correctly for admins', async () => {
  const removeCollaborator = jest.fn();

  const tree = render(
    <CollaboratorsList
      users={users}
      showAdminActions={true}
      removeCollaborator={removeCollaborator}
    />,
  );
  expect(tree.container).toMatchSnapshot();
});

it('Renders collaborators list correctly for non-admins', async () => {
  const removeCollaborator = jest.fn();

  const tree = render(
    <CollaboratorsList
      users={users}
      showAdminActions={false}
      removeCollaborator={removeCollaborator}
    />,
  );
  expect(tree.container).toMatchSnapshot();
});

it('Calls remove collaborator mutation', async () => {
  const removeCollaborator = jest.fn();

  const tree = render(
    <CollaboratorsList
      users={users}
      showAdminActions={true}
      removeCollaborator={removeCollaborator}
    />,
  );

  // Start with two collaborators
  expect(tree.queryAllByTestId('remove-button').length).toBe(2);

  act(() => {
    fireEvent.click(tree.queryAllByTestId('remove-button')[0]);
  });

  act(() => {
    fireEvent.click(tree.queryAllByTestId('remove-confirm')[0]);
  });

  // End with one collaborator
  expect(removeCollaborator.mock.calls.length).toBe(1);
});
