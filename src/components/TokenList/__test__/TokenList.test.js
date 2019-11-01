import React from 'react';
import {render} from 'react-testing-library';
import TokenList from '../TokenList';

it('renders token list correctly - no data', () => {
  const tree = render(<TokenList />);
  expect(tree.container).toMatchSnapshot();
});
