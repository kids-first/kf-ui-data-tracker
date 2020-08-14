/* eslint-disable no-loop-func */
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId.json';
import validate from '../validate';

let file = {
  lastModified: 1567797130510,
  name: 'organize.tsv',
  size: 7,
  type: 'text/tab-separated-values',
  webkitRelativePath: '',
};

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
    const validateResults = validate(
      {file_name: word},
      file,
      studyByKfId.data.studyByKfId.files.edges,
    );
    expect(validateResults.file_name.blacklisted).toBeTruthy();
  });
}

const FILE_EXT = ['csv', 'tsv', 'txt', 'md', 'xlsx'];

for (let index = 0; index < FILE_EXT.length; index++) {
  const word = `.${FILE_EXT[index]}`;

  it(`shows validation indicators for Document Title input with file extension: "${word}" `, async () => {
    const validateResults = validate(
      {file_name: word},
      file,
      studyByKfId.data.studyByKfId.files.edges,
    );
    expect(validateResults.file_name.file_ext).toBeTruthy();
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
    const validateResults = validate(
      {file_name: word},
      file,
      studyByKfId.data.studyByKfId.files.edges,
    );
    expect(validateResults.file_name.dates).toBeTruthy();
  });
}

const SIMILAR_NAMES = ['organization.jpeg', 'organization.jp'];

for (let index = 0; index < SIMILAR_NAMES.length; index++) {
  const word = `${SIMILAR_NAMES[index]}`;

  it(`shows validation indicators for Document Title input with similar name: "${
    SIMILAR_NAMES[index]
  }" `, async () => {
    const validateResults = validate(
      {file_name: word},
      file,
      studyByKfId.data.studyByKfId.files.edges,
    );
    expect(validateResults.file_name.existing_similarity).toBeTruthy();
    if (index === 0) {
      expect(validateResults.file_name.exact_matches).toBeTruthy();
    }
  });
}
