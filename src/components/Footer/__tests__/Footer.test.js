import React from 'react';
import wait from 'waait';
import {render, cleanup} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import Footer from '../Footer';

afterEach(cleanup);

it('renders footer correctly -- local', async () => {
  process.env = Object.assign(process.env, {
    REACT_APP_ENV: 'local',
    REACT_APP_COMMITHASH: 'gb110ca36',
    REACT_APP_LAST_VERSION: '0.8.1-80-gb110ca36',
  });

  const tree = render(
    <MockedProvider mocks={mocks}>
      <Footer />
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders footer correctly -- production', async () => {
  process.env = Object.assign(process.env, {
    REACT_APP_ENV: 'production',
    REACT_APP_COMMITHASH: 'gb110ca36',
    REACT_APP_LAST_VERSION: '0.8.1-80-gb110ca36',
  });

  const tree = render(
    <MockedProvider mocks={mocks}>
      <Footer />
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders footer correctly -- qa', async () => {
  process.env = Object.assign(process.env, {
    REACT_APP_ENV: 'qa',
    REACT_APP_COMMITHASH: 'gb110ca36',
    REACT_APP_LAST_VERSION: '0.8.2',
  });

  const tree = render(
    <MockedProvider mocks={mocks}>
      <Footer />
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders footer correctly -- development', async () => {
  process.env = Object.assign(process.env, {
    REACT_APP_ENV: 'development',
    REACT_APP_COMMITHASH: 'gb110ca36',
    REACT_APP_LAST_VERSION: '0.8.2',
  });

  const tree = render(
    <MockedProvider mocks={mocks}>
      <Footer />
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
});
