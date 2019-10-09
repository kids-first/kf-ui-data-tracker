import React from 'react';
import {render, fireEvent, act} from 'react-testing-library';
import TokenList from '../TokenList';

it('renders token list correctly - displaying look & hidden look', () => {
  const tokens = [
    {
      node: {
        id: 'token1',
        name: 'my token 1',
        createdAt: '2019-06-13T12:05:39.381525+00:00',
        token: 'blahtestingtokenstringhere',
        creator: {
          username: 'John',
          picture:
            'https://docs.atlassian.com/aui/8.3.1/docs/images/avatar-person.svg',
        },
      },
    },
    {
      node: {
        id: 'token2',
        name: 'my token 2',
        createdAt: '2019-06-13T12:05:39.381525+00:00',
        token: 'test***********************',
        creator: {
          username: 'John',
          picture:
            'https://docs.atlassian.com/aui/8.3.1/docs/images/avatar-person.svg',
        },
      },
    },
    {
      node: {
        id: 'token3',
        name: 'my token 3',
        createdAt: '2019-06-13T12:05:39.381525+00:00',
        token: 'test***********************',
      },
    },
  ];
  const tree = render(<TokenList tokens={tokens} deleteToken={jest.fn()} />);
  expect(tree.container).toMatchSnapshot();

  // Click on the delete token button
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-token-button')[0]);
  });
});

it('renders token list correctly - no data', () => {
  const tree = render(<TokenList />);
  expect(tree.container).toMatchSnapshot();
});
