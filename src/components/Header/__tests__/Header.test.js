import React from 'react';
import {render} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import Header from '../Header';

it('renders correctly', () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
