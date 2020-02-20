import React from 'react';
import wait from 'waait';
import {render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import ConfigurationView from '../ConfigurationView';

jest.mock('auth0-js');

it('renders the configuration page', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <ConfigurationView />
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
});
