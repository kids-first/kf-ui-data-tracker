import React from 'react';
import wait from 'waait';
import {render, cleanup, fireEvent, act} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import FileActionButtons from '../FileActionButtons';

afterEach(cleanup);
it('File Action Buttons renders correctly -- default look', async () => {
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <FileActionButtons
        node={file}
        studyId={studyId}
        downloadFileMutation={jest.fn().mockResolvedValue({
          data: {
            signedUrl: {
              url:
                'http://localhost:8080/download/study/SD_8WX8QQ06/file/SF_5ZPEM16',
            },
          },
        })}
        deleteFile={jest.fn()}
      />
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on the download file button
  act(() => {
    fireEvent.click(tree.getAllByTestId('download-file')[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the delete file button
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-button')[0]);
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('File Action Buttons renders correctly -- vertical look', () => {
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <FileActionButtons
        node={file}
        studyId={studyId}
        downloadFileMutation={jest.fn()}
        deleteFile={jest.fn()}
        vertical
      />
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('File Action Buttons renders correctly -- fluid look', () => {
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <FileActionButtons
        node={file}
        studyId={studyId}
        downloadFileMutation={jest.fn()}
        deleteFile={jest.fn()}
        fluid
      />
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
