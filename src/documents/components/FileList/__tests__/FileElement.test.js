import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, cleanup} from '@testing-library/react';
import FileElement from '../FileElement';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import {MockedProvider} from '@apollo/react-testing';

afterEach(cleanup);
it('renders correctly', () => {
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <table>
          <tbody>
            <FileElement
              fileListId={studyByKfId.data.studyByKfId.kfId}
              fileNode={file}
              selection={[]}
            />
          </tbody>
        </table>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders loading state', () => {
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <table>
          <tbody>
            <FileElement
              loading={true}
              fileNode={file}
              fileListId={studyByKfId.data.studyByKfId.kfId}
              selection={[]}
            />
          </tbody>
        </table>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders latest temporary state', () => {
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const DATE_TO_USE = new Date('2018-09-27T05:32:27+00:00');
  const _Date = Date;
  global.Date = jest.fn(() => DATE_TO_USE);
  global.Date.UTC = _Date.UTC;
  global.Date.parse = _Date.parse;
  global.Date.now = _Date.now;

  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <table>
          <tbody>
            <FileElement
              loading={true}
              fileNode={file}
              fileListId={studyByKfId.data.studyByKfId.kfId}
              selection={[]}
            />
          </tbody>
        </table>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
