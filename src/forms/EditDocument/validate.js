/* eslint-disable no-useless-escape */
import * as stringSimilarity from 'string-similarity';
import {sortFilesBySimilarity} from '../../common/fileUtils';

const MIN_SIMILARITY = 0.65;
const DOC_NAME_REGEXS = [
  /(new)|(final)|(modified)|(saved?)|(updated?)|(edit)|(\([0-9]\))|(\[[0-9]\])/, // black listed words
  /[\.\$\@\&\!\%\*\]\[\#\?\/\-]/, //special chars
  /\.[a-z]{2,}/, // file extensions
  /[0-9]{1,2}[\.\/\-][0-9]{1,2}[\.\/\-][0-9]{2,4}|[0-9]{8}/, // dates
];

const replaceWithSpaces = str =>
  str
    .replace(/-|_/gi, ' ')
    .trim()
    .toLowerCase();

const removeFileExt = str => str.replace(/\.(.*)/, '');

const validate = ({file_name}, fileNode, studyFiles) => {
  let errors = {
    file_name: {
      blacklisted: null,
      special_char: null,
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
    0.33,
  );

  const uploadedFileSimilarity = stringSimilarity.compareTwoStrings(
    DOC_NAME_INPUT,
    cleanFileName,
  );

  // more than a quarter 75% of the inputed Document Title bigrams matches names of
  //existing study files
  if (similarDocs.matches.length > 0)
    errors.file_name.existing_similarity = true;

  // black listed words
  if (
    new RegExp(DOC_NAME_REGEXS[0], 'gi').test(file_name) ||
    uploadedFileSimilarity > MIN_SIMILARITY
  )
    errors.file_name.upload_similarity = true;

  if (new RegExp(DOC_NAME_REGEXS[1], 'gi').test(DOC_NAME_INPUT))
    // special chars
    errors.file_name.special_char = true;

  // file extensions in name
  if (new RegExp(DOC_NAME_REGEXS[2], 'gi').test(DOC_NAME_INPUT)) {
    errors.file_name.file_ext = true;
  }

  // date of formats (dd-mm-yyy, d-m-yy, yyyymmdd, yymmdd, dd.mm.yyyy, dd.mm.yy)
  if (new RegExp(DOC_NAME_REGEXS[3], 'gi').test(DOC_NAME_INPUT))
    errors.file_name.dates = true;

  return errors;
};

export default validate;
