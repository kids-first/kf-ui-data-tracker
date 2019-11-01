import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent, cleanup, act} from 'react-testing-library';
import UploadWizard from '../UploadWizard';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/studyByKfId.json';

afterEach(cleanup);

const handleClose = jest.fn();
const studyFiles = studyByKfId.data.studyByKfId.files.edges;
const uploadedFile = new File([''], 'organize.tsv', {
  type: 'text/tab-separated-values',
  lastModified: new Date(0),
});
const historyMock = {
  push: jest.fn(),
  location: {pathname: '/study/SD_8WX8QQ06/documents'},
};
let file = {
  lastModified: 1567797130510,
  name: 'organize.tsv',
  size: 7,
  type: 'text/tab-separated-values',
  webkitRelativePath: '',
};
const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

it('renders with uploaded file name', async () => {
  const {container, getByText} = render(
    <MockedProvider mocks={mocks}>
      <UploadWizard
        history={historyMock}
        studyId={studyByKfId.data.studyByKfId.kfId}
        file={uploadedFile}
        fileList={studyFiles}
        onCloseDialog={handleClose}
      />
    </MockedProvider>,
  );

  await wait(0);

  //react portal w/ modal is added to document
  expect(document.querySelectorAll('.ui.modal').length).toBe(1);
  // renders the uploaded file name in the header
  expect(getByText(/organize\.tsv/i)).toBeTruthy();

  expect(container).toMatchSnapshot();
});

it('progresses to Step 1: Update Existing Study Document ', async () => {
  const {getByText, getByTestId, queryAllByTestId} = render(
    <MockedProvider mocks={mocks}>
      <UploadWizard
        history={historyMock}
        studyId={studyByKfId.data.studyByKfId.kfId}
        file={uploadedFile}
        fileList={studyFiles}
        onCloseDialog={handleClose}
      />
    </MockedProvider>,
  );

  await wait(0);

  act(() => {
    fireEvent.click(getByTestId('update-existing-button'));
  });

  await wait(0);

  expect(getByText(/Update Existing Study Document/i)).toBeTruthy();
  // should render a list of two documents
  expect(queryAllByTestId(/document-item/).length).toBe(studyFiles.length);
  // should only have one similar document in list
  expect(getByTestId('similar-document-item')).toBeDefined();
});

it('progresses to Step 2: Summarize Your Update', async () => {
  const {getByText, getByTestId} = render(
    <MockedProvider mocks={mocks}>
      <UploadWizard
        history={historyMock}
        studyId={studyByKfId.data.studyByKfId.kfId}
        file={uploadedFile}
        fileList={studyFiles}
        onCloseDialog={handleClose}
      />
    </MockedProvider>,
  );

  await wait(0);

  // choose update existing document
  act(() => {
    fireEvent.click(getByTestId('update-existing-button'));
  });

  await wait(0);

  // select the first document in the list "organize.jpeg"
  act(() => {
    fireEvent.click(getByTestId('similar-document-item'));
  });

  await wait(0);
  /* make sure we're on the right step */
  expect(getByText(/Summarize Your Update/i)).toBeTruthy();
  /* make sure we're updating the correct document */
  expect(getByText(/organization\.jpeg/i)).toBeTruthy();
});

it('progresses to Step 3: Document Updated ', async done => {
  const {getByText, getByTestId} = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/documents']}>
        <UploadWizard
          history={historyMock}
          studyId={studyByKfId.data.studyByKfId.kfId}
          file={file}
          fileList={studyFiles}
          onCloseDialog={handleClose}
        />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait(0);

  act(() => {
    fireEvent.click(getByTestId('update-existing-button'));
  });

  await wait(0);

  // select the first document in the list
  act(() => {
    fireEvent.click(getByTestId('similar-document-item'));
  });

  await wait(0);
  const inputVal = 'version description';
  act(() => {
    fireEvent.change(getByTestId('description-input'), {
      target: {value: inputVal},
    });
  });

  // make sure our description is input correctly
  expect(getByTestId('description-input').value).toBe(inputVal);

  act(() => {
    fireEvent.click(getByTestId('upload-button'));
  });
  await wait(10);

  expect(handleClose.mock.calls.length).toBe(0);
  await wait(10);
  expect(getByText(/Document Updated/i)).toBeTruthy();

  // make sure we progress the to sucess screen
  expect(getByText('Updated Document organization.jpeg')).toBeTruthy();
  // make sure close timer begins
  expect(getByText(/Exit \(3\)/i)).toBeTruthy();

  // wait 1 sec and make sure timer is counting down
  await sleep(1000);
  expect(getByText(/Exit \(2\)/i)).toBeTruthy();
  expect(handleClose.mock.calls.length).toBe(0);
  await sleep(1000);
  expect(getByText(/Exit \(1\)/i)).toBeTruthy();
  await sleep(1000);
  // make sure it closes after 3 seconds
  expect(handleClose.mock.calls.length).toBe(1);

  done();
}, 6000);
