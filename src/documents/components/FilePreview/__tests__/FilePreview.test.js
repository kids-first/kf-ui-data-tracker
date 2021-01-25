import React from 'react';
import wait from 'waait';
import {render, cleanup, fireEvent, act} from '@testing-library/react';
import {MockedProvider} from '@apollo/client/testing';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import {FilePreview} from '../';

afterEach(cleanup);

const mockResponse = (status = 200, returnBody) => {
  global.Headers = jest.fn();
  global.fetch = jest.fn().mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve({
        ok: true,
        status,
        text: () => {
          return returnBody ? returnBody : {};
        },
      });
    });
  });
};

it('File Preview renders correctly', async () => {
  mockResponse(200, 'a,b,c,\n1,2,3,\n4,5,6,\n');

  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <FilePreview file={file} />
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText('Preview File'));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('File Preview renders error correctly', async () => {
  mockResponse(200, 'not a csv or tsv string');

  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <FilePreview file={file} />
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText('Preview File'));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});
