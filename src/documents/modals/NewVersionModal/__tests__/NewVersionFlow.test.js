import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent, cleanup, act} from 'react-testing-library';
import {NewVersionFlow} from '../NewVersionFlow';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import fileByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/fileByKfId.json';
import {AnalyticsMockProvider} from '../../../../analyticsTracking';

afterEach(cleanup);

it('creates a new version', async () => {
  const fileNode = fileByKfId.data.fileByKfId;
  const handleClose = jest.fn();
  const createVersion = jest.fn(
    _ =>
      new Promise((resolve, reject) => {
        process.nextTick(() => resolve({data: 'test'}));
      }),
  );
  const tree = render(
    <AnalyticsMockProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter
          initialEntries={['/study/SD_8WX8QQ06/documents/SF_5ZPEM167']}
        >
          <NewVersionFlow
            match={{
              params: {
                kfId: 'SD_8WX8QQ06',
                fileId: 'SF_5ZPEM167',
              },
            }}
            fileNode={fileNode}
            handleClose={handleClose}
            createVersion={createVersion}
          />
        </MemoryRouter>
      </MockedProvider>
    </AnalyticsMockProvider>,
  );
  await wait(0);

  const uploadBox = tree
    .queryAllByText(/drag and drop/i)
    .map(f => f.textContent);
  expect(uploadBox.length).toBe(1);

  // Create and upload file
  const file = new File(['content'], 'my.txt');
  const formElement = tree.getByLabelText(/choose a file/i);
  Object.defineProperty(formElement, 'files', {value: [file]});

  act(() => {
    fireEvent.change(formElement);
  });
  await wait(0);

  // Should now be on the description step
  expect(tree.getByText('my.txt')).toBeDefined();
  expect(tree.getByText(/summarize document changes/i)).toBeDefined();

  const description = tree.getByTestId('description-input');
  act(() => {
    fireEvent.change(description, {target: {value: 'my changes'}});
  });

  const uploadButton = tree.getByText(/UPLOAD/);
  act(() => {
    fireEvent.click(uploadButton);
  });
  await wait(0);

  // Check that the handles were called
  expect(createVersion.mock.calls.length).toBe(1);
  expect(handleClose.mock.calls.length).toBe(1);
});
