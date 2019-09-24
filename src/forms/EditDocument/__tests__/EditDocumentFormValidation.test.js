/* eslint-disable no-loop-func */
import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId.json';
import {Segment, Button} from 'semantic-ui-react';
import {render, fireEvent, cleanup, act} from 'react-testing-library';
import EditDocumentForm from '../EditDocumentForm';

afterEach(cleanup);

let file = {
  lastModified: 1567797130510,
  name: 'organize.tsv',
  size: 7,
  type: 'text/tab-separated-values',
  webkitRelativePath: '',
};

const historyMock = {
  push: jest.fn(),
  location: {pathname: '/study/SD_8WX8QQ06/documents/new-documents'},
};
let errors = {};

it('blocks submission for invalid Document Name input', async () => {
  const handleSubmit = jest.fn();

  const {container, getByTestId, getByText, queryAllByText} = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
      >
        <EditDocumentForm
          studyFiles={studyByKfId.data.studyByKfId.files.edges}
          isAdmin={false}
          fileNode={file}
          handleSubmit={handleSubmit}
          errors={errors}
          history={historyMock}
          showFieldHints={true}
          submitButtons={(disabled, onUploading) => (
            <Segment vertical basic compact>
              <Button
                floated="right"
                type="submit"
                primary={errors.length === 0}
                disabled={disabled}
              >
                {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
              </Button>
              <Button floated="right" primary={errors.length > 0}>
                CANCEL
              </Button>
            </Segment>
          )}
        />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait(0);

  //react portal w/ modal is added to document
  expect(document.querySelectorAll('.ui.form').length).toBe(1);
  expect(container).toMatchSnapshot();

  // Update file name with an existing file
  // this should make the form invalid and block submission
  const nameInput = getByTestId('name-input');
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: studyByKfId.data.studyByKfId.files.edges[0].node.name},
    });
  });
  await wait();

  expect(queryAllByText(/UPLOAD/).length).toBe(1);
  // Click 'UPLOAD' button to return to file detail view
  act(() => {
    fireEvent.click(getByText(/UPLOAD/));
  });

  await wait();
  expect(handleSubmit.mock.calls.length).toBe(0);
});

const BLACKLISTED_WORDS = [
  'new',
  'final',
  'modified',
  'save',
  'update',
  'edit',
  ...[...new Array(10)].map((i, idx) => `(${idx})`),
  ...[...new Array(10)].map((i, idx) => `[${idx}]`),
];

for (let index = 0; index < BLACKLISTED_WORDS.length; index++) {
  const word = BLACKLISTED_WORDS[index];

  it(`shows validation indicators for Document Title input blacklisted word: "${word}" `, async () => {
    const handleSubmit = jest.fn();

    const {getByTestId, getByText, queryAllByText} = render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter
          initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
        >
          <EditDocumentForm
            studyFiles={studyByKfId.data.studyByKfId.files.edges}
            isAdmin={false}
            fileNode={file}
            handleSubmit={handleSubmit}
            errors={errors}
            history={historyMock}
            showFieldHints={true}
            submitButtons={(disabled, onUploading) => (
              <Segment vertical basic compact>
                <Button
                  floated="right"
                  type="submit"
                  primary={errors.length === 0}
                  disabled={disabled}
                >
                  {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
                </Button>
                <Button floated="right" primary={errors.length > 0}>
                  CANCEL
                </Button>
              </Segment>
            )}
          />
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait(0);

    // Update file name with an existing file
    // this should make the form invalid and block submission
    const nameInput = getByTestId('name-input');
    act(() => {
      fireEvent.change(nameInput, {
        target: {value: word},
      });
    });
    await wait();

    expect(nameInput.value).toBe(word);
    // shows the update existing document notice
    expect(getByText(/Update Existing Document Instead\?/i)).toBeTruthy();
    // should mark the correct validation indicator(s)
    const indicator_items = document.querySelectorAll('.item');
    expect(indicator_items[1].querySelector('.info.circle')).toBeTruthy();
    expect(indicator_items[2].querySelector('.red.x.icon')).toBeTruthy();

    // expect(docuemnt.querySelectorAll('.listitem')).toBeTruthy();
    expect(queryAllByText(/UPLOAD/).length).toBe(1);
    // Click 'UPLOAD' button to return to file detail view
    act(() => {
      fireEvent.click(getByText(/UPLOAD/));
    });

    await wait();
    expect(handleSubmit.mock.calls.length).toBe(0);
  });
}

const FILE_EXT = ['csv', 'tsv', 'txt', 'md', 'xlsx'];

for (let index = 0; index < FILE_EXT.length; index++) {
  const word = `.${FILE_EXT[index]}`;

  it(`shows validation indicators for Document Title input with file extension: "${word}" `, async () => {
    const handleSubmit = jest.fn();

    const {getByTestId, getByText, queryAllByText} = render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter
          initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
        >
          <EditDocumentForm
            studyFiles={studyByKfId.data.studyByKfId.files.edges}
            isAdmin={false}
            fileNode={file}
            handleSubmit={handleSubmit}
            errors={errors}
            history={historyMock}
            showFieldHints={true}
            submitButtons={(disabled, onUploading) => (
              <Segment vertical basic compact>
                <Button
                  floated="right"
                  type="submit"
                  primary={errors.length === 0}
                  disabled={disabled}
                >
                  {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
                </Button>
                <Button floated="right" primary={errors.length > 0}>
                  CANCEL
                </Button>
              </Segment>
            )}
          />
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait(0);

    // Update file name with an existing file
    // this should make the form invalid and block submission
    const nameInput = getByTestId('name-input');
    act(() => {
      fireEvent.change(nameInput, {
        target: {value: word},
      });
    });
    await wait();
    expect(nameInput.value).toBe(word);
    // should mark the correct validation indicator(s)
    const indicator_items = document.querySelectorAll('.item');
    expect(indicator_items[2].querySelector('.red.x.icon')).toBeTruthy();

    expect(queryAllByText(/UPLOAD/).length).toBe(1);
    // Click 'UPLOAD' button to return to file detail view
    act(() => {
      fireEvent.click(getByText(/UPLOAD/));
    });

    await wait();
    expect(handleSubmit.mock.calls.length).toBe(0);
  });
}

const DATE_FORMATS = [
  ['0-0-00', 'M-D-YY'],
  ['00-00-00', 'MM-DD-YY'],
  ['00-00-0000', 'MM-DD-YYYY'],
  ['00.00.00', 'MM.DD.YY'],
  ['00.00.0000', 'MM.DD.YYYY'],
  ['00000000', 'MMDDYYYY'],
];

for (let index = 0; index < DATE_FORMATS.length; index++) {
  const word = DATE_FORMATS[index][0];

  it(`shows validation indicators for Document Title input with date in format: "${
    DATE_FORMATS[index][1]
  }" `, async () => {
    const handleSubmit = jest.fn();

    const {getByTestId, getByText, queryAllByText} = render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter
          initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
        >
          <EditDocumentForm
            studyFiles={studyByKfId.data.studyByKfId.files.edges}
            isAdmin={false}
            fileNode={file}
            handleSubmit={handleSubmit}
            errors={errors}
            history={historyMock}
            showFieldHints={true}
            submitButtons={(disabled, onUploading) => (
              <Segment vertical basic compact>
                <Button
                  floated="right"
                  type="submit"
                  primary={errors.length === 0}
                  disabled={disabled}
                >
                  {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
                </Button>
                <Button floated="right" primary={errors.length > 0}>
                  CANCEL
                </Button>
              </Segment>
            )}
          />
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait(0);

    // Update file name with an existing file
    // this should make the form invalid and block submission
    const nameInput = getByTestId('name-input');
    act(() => {
      fireEvent.change(nameInput, {
        target: {value: word},
      });
    });
    await wait();
    expect(nameInput.value).toBe(word);

    expect(queryAllByText(/UPLOAD/).length).toBe(1);

    // should mark the correct validation indicator(s)
    const indicator_items = document.querySelectorAll('.item');
    expect(indicator_items[3].querySelector('.red.x.icon')).toBeTruthy();

    // Click 'UPLOAD' button to return to file detail view
    act(() => {
      fireEvent.click(getByText(/UPLOAD/));
    });

    await wait();
    expect(handleSubmit.mock.calls.length).toBe(0);
  });
}
