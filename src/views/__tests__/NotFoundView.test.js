import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import {coordMocks} from '../../../__mocks__/kf-api-release-coordinator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders error view on invalid path /XXXX', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/XXXX']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText(/404 Page not found/i)).not.toBeNull();
  expect(tree.queryAllByText(/XXXX/i)).not.toBeNull();
  act(() => {
    fireEvent.click(tree.getByText(/click here to go back to your studies/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders no error view on skipped path', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/callback']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText(/404 Page not found/i) === []);
});

it('renders error view on invalid new study step', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/new-study/info-invalid']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText(/404 Page not found/i)).not.toBeNull();
});

it('renders error view on invalid study id', async () => {
  const tree_info = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/SD_INVALID/basic-info/external']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree_info.container).toMatchSnapshot();
  expect(tree_info.queryAllByText(/Study not found/i)).not.toBeNull();
  expect(
    tree_info.queryAllByText(/Cannot find the study with ID SD_INVALID/i),
  ).not.toBeNull();

  const tree_documents = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/SD_INVALID/documents']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree_documents.container).toMatchSnapshot();
  expect(tree_documents.queryAllByText(/Study not found/i)).not.toBeNull();
  expect(
    tree_documents.queryAllByText(/Cannot find the study with ID SD_INVALID/i),
  ).not.toBeNull();

  const tree_cavatica = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/SD_INVALID/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree_cavatica.container).toMatchSnapshot();
  expect(tree_cavatica.queryAllByText(/Study not found/i)).not.toBeNull();
  expect(
    tree_cavatica.queryAllByText(/Cannot find the study with ID SD_INVALID/i),
  ).not.toBeNull();

  const tree_logs = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/SD_INVALID/logs']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree_logs.container).toMatchSnapshot();
  expect(tree_logs.queryAllByText(/Study not found/i)).not.toBeNull();
  expect(
    tree_logs.queryAllByText(/Cannot find the study with ID SD_INVALID/i),
  ).not.toBeNull();

  const tree_releases = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/SD_INVALID/releases']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree_releases.container).toMatchSnapshot();
  expect(tree_releases.queryAllByText(/Study not found/i)).not.toBeNull();
  expect(
    tree_releases.queryAllByText(/Cannot find the study with ID SD_INVALID/i),
  ).not.toBeNull();
});

it('renders error view on invalid document id', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/SF_INVALIDS']}
      >
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText(/Document not found/i)).not.toBeNull();
  expect(
    tree.queryAllByText(/Cannot find the document with ID SF_INVALIDS/i),
  ).not.toBeNull();
});

it('renders error view on invalid study info step name', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks.concat(Object.values(coordMocks))}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/basic-info/invalid']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText(/Study info step not found/i)).not.toBeNull();
  expect(
    tree.queryAllByText(/Cannot find the study info step invalid/i),
  ).not.toBeNull();
});
