import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders study nav bar with error for fetching study', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[2], mocks[8], mocks[38]]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/basic-info/info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/Network error: something went wrong/i),
  ).not.toBeNull();
});

it('renders study nav bar with error in study creation', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[8], mocks[43], mocks[43], mocks[40], mocks[39]]}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/basic-info/info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
    {
      container: document.body,
    },
  );

  expect(tree.container).toMatchSnapshot();

  await wait(10);
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(
      tree.getByText(/This study may not have been created successfully/i),
    );
  });

  await wait(10);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Initializing Study Resources/)).not.toBeNull();

  await wait(2000);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Had Error Creating Your Study/)).not.toBeNull();

  act(() => {
    fireEvent.click(tree.getByText(/Go To Study Info/i));
  });
  await wait(10);

  act(() => {
    fireEvent.click(
      tree.getByText(/This study may not have been created successfully/i),
    );
  });

  await wait(2000);

  act(() => {
    fireEvent.click(tree.getByText(/Upload Documents/i));
  });
  await wait(10);
}, 8000);
