/* eslint-disable no-useless-escape */
import * as stringSimilarity from 'string-similarity';
import {sortFilesBySimilarity} from '../../common/fileUtils';
import {
  STUDY_DOCS_SIMILARITY_THRESHOLD,
  DOC_TITLE_FILENAME_SIMILARITY_THRESHOLD,
} from '../../common/globals';

const MIN_SIMILARITY = DOC_TITLE_FILENAME_SIMILARITY_THRESHOLD;
const DOC_NAME_REGEXS = [
  /(new)|(final)|(modified)|(saved?)|(updated?)|(edit)|(\([0-9]\))|(\[[0-9]\])/, // black listed words
  /\.[a-z]{2,}/, // file extensions
  /[0-9]{1,2}[\.\/\-][0-9]{1,2}[\.\/\-][0-9]{2,4}|[0-9]{8}/, // dates
];

const replaceWithSpaces = str =>
  str
    .replace(/-|_/gi, ' ')
    .trim()
    .toLowerCase();

const removeFileExt = str => str.replace(/\.(.*)/, '');

const validate = ({file_name}, fileNode, studyFiles = []) => {
  let errors = {
    file_name: {
      blacklisted: null,
      existing_similarity: null,
      upload_similarity: null,
      file_ext: null,
      dates: null,
    },
  };

  let cleanFileName = replaceWithSpaces(removeFileExt(fileNode.name));
  const DOC_NAME_INPUT = replaceWithSpaces(file_name);

  const similarDocs = sortFilesBySimilarity(
    {name: DOC_NAME_INPUT},
    studyFiles,
    STUDY_DOCS_SIMILARITY_THRESHOLD,
  );

  const uploadedFileSimilarity = stringSimilarity.compareTwoStrings(
    DOC_NAME_INPUT,
    cleanFileName,
  );

  //existing study files
  if (similarDocs && similarDocs.matches.length > 0)
    errors.file_name.existing_similarity = true;

  // black listed words
  if (new RegExp(DOC_NAME_REGEXS[0], 'gi').test(file_name))
    errors.file_name.blacklisted = true;

  if (
    new RegExp(DOC_NAME_REGEXS[0], 'gi').test(file_name) ||
    uploadedFileSimilarity > MIN_SIMILARITY
  )
    errors.file_name.upload_similarity = true;

  // file extensions in name
  if (new RegExp(DOC_NAME_REGEXS[1], 'gi').test(DOC_NAME_INPUT)) {
    errors.file_name.file_ext = true;
  }

  // date of formats (dd-mm-yyy, d-m-yy, yyyymmdd, yymmdd, dd.mm.yyyy, dd.mm.yy)

  if (new RegExp(DOC_NAME_REGEXS[2], 'gi').test(file_name))
    errors.file_name.dates = true;

  // only return errros object if any exists
  return Object.values(errors.file_name).some(x => x) ? errors : {};
};

export default validate;
