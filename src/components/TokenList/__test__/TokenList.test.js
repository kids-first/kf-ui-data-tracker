import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from 'react-testing-library';
import TokenList from '../TokenList';
import devTokens from '../../../../__mocks__/kf-api-study-creator/responses/devTokens.json';

it('renders token list correctly - no data', () => {
  const tree = render(<TokenList />);
  expect(tree.container).toMatchSnapshot();
});

it('renders token list correctly - with new token', async () => {
  const tokens = devTokens.data.allDevTokens.edges;
  const newToken = devTokens.data.allDevTokens.edges[0].node;
  const tree = render(
    <TokenList tokens={tokens} newToken={newToken} deleteToken={jest.fn()} />,
  );

  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click on the delete token button
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-token-button')[0]);
  });
});
