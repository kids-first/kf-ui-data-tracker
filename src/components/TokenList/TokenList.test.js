import React from 'react';
import {render} from 'react-testing-library';
import TokenList from './TokenList';

it('renders correctly', () => {
  const tokens = [
    {
      node: {
        id: 'token1',
        name: 'my token',
        createdAt: '2019-06-13T12:05:39.381525+00:00',
        token: 'blah************',
        author: {
          username: 'John',
          picture:
            'https://docs.atlassian.com/aui/8.3.1/docs/images/avatar-person.svg',
        },
      },
    },
  ];
  const tree = render(<TokenList tokens={tokens} deleteToken={jest.fn()} />);
  expect(tree.container).toMatchSnapshot();
});
