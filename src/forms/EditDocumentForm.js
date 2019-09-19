/* eslint-disable  no-useless-escape */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import * as stringSimilarity from 'string-similarity';
import {Formik, Field} from 'formik';
import SelectElement from '../components/FileAnnotation/SelectElement';
import Badge from '../components/Badge/Badge';
import {
  fileTypeDetail,
  versionState,
  sortFilesBySimilarity,
} from '../common/fileUtils';
import {
  Form,
  TextArea,
  Dropdown,
  Message,
  List,
  Icon,
  Button,
} from 'semantic-ui-react';

const MIN_SIMILARITY = 0.65;
const DOC_NAME_REGEXS = [
  /(new)|(final)|(modified)|(saved)|(updated?)|(edit)|(\([0-9]\))|(\[[0-9]\])/, // black listed words
  /[\.\$\@\&\!\%\*\]\[\#\?\/\-]/, //special chars
  /\.[a-z]{2,}/, // file extensions
  /[0-9]{1,2}[\.\/\-][0-9]{1,2}[\.\/\-][0-9]{2,4}|[0-9]{8}/, // dates
];

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

  const replaceWithSpaces = str =>
    str
      .replace(/-|_/gi, ' ')
      .trim()
      .toLowerCase();
  const removeFileExt = str => str.replace(/\.(.*)/, '');
  let cleanFileName = replaceWithSpaces(removeFileExt(fileNode.name));
  const DOC_NAME_INPUT = replaceWithSpaces(file_name);

  const similarDocs = sortFilesBySimilarity(
    {name: DOC_NAME_INPUT},
    studyFiles,
    0.33,
  );
  console.log(similarDocs);

  const uploadedFileSimilarity = stringSimilarity.compareTwoStrings(
    DOC_NAME_INPUT,
    cleanFileName,
  );
  // console.log(
  //   `${DOC_NAME_INPUT} + ${cleanFileName} = ${uploadedFileSimilarity} (${MIN_SIMILARITY})`,
  // );

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

const ExistingDocsMessage = ({existingDocs, fileNameInput, errors}) => {
  const [showSimilar, setShowSimilar] = useState(false);
  const similarStudyDocs = sortFilesBySimilarity(
    {name: fileNameInput},
    existingDocs,
    0.33,
  );
  const SimilarTitleContent = () => (
    <>
      We found
      <strong>
        {similarStudyDocs.matches.length ? similarStudyDocs.matches.length : ''}{' '}
        similar document titles
      </strong>{' '}
      in this study.
      <a
        href=" "
        onClick={e => {
          e.preventDefault();
          setShowSimilar(!showSimilar);
        }}
      >
        {' '}
        {!showSimilar ? 'Show' : 'Hide'} Similar
      </a>
      {showSimilar && (
        <List>
          {similarStudyDocs.matches.map(doc => (
            <List.Item>
              <List.Icon name="file" />
              {doc.target} (
              {
                existingDocs.filter(({node}) => node.name === doc.target)[0]
                  .node.versions.edges.length
              }{' '}
              versions)
            </List.Item>
          ))}
        </List>
      )}
    </>
  );

  const CopiedFileContent = () => (
    <>Looks like this may be a copy of an existing file.</>
  );

  return (
    <Message info icon size="small">
      <Icon name="info circle" verticalAlign="top" />
      <Message.Content>
        <Message.Header>Update Existing Document Instead?</Message.Header>
        {errors.file_name.upload_similarity && <CopiedFileContent />}
        {errors.file_name.existing_similarity && <SimilarTitleContent />}
      </Message.Content>

      <Button floated="right">Update Existing</Button>
    </Message>
  );
};

const TitleHints = ({errors}) => {
  return (
    <List size="tiny">
      <List.Item>
        <Icon
          name={
            errors.file_name && errors.file_name.existing_similarity
              ? 'info circle'
              : 'check'
          }
          color={
            errors.file_name && errors.file_name.existing_similarity
              ? 'teal'
              : ''
          }
        />
        Document Title should be unique within study.
      </List.Item>
      <List.Item>
        <Icon
          name={
            errors.file_name && errors.file_name.special_char ? 'x' : 'check'
          }
          color={errors.file_name && errors.file_name.special_char ? 'red' : ''}
        />
        Avoid using special characters ( . $ @ & $ ! % * # ? / - )
      </List.Item>
      <List.Item>
        <Icon
          name={
            (errors.file_name && errors.file_name.file_ext) ||
            (errors.file_name && errors.file_name.upload_similarity)
              ? 'x'
              : 'check'
          }
          color={
            (errors.file_name && errors.file_name.file_ext) ||
            (errors.file_name && errors.file_name.upload_similarity)
              ? 'red'
              : ''
          }
        />
        Name your document different than the uploaded file to help give us more
        context.
      </List.Item>

      <List.Item>
        <Icon
          name={errors.file_name && errors.file_name.dates ? 'x' : 'check'}
          color={errors.file_name && errors.file_name.dates ? 'red' : ''}
        />
        Avoid using specific dates, they can be recorded in the contents section
        or metadata.
      </List.Item>
    </List>
  );
};

/**
 * Form to edit document information or annotate new file for uploading
 */
const EditDocumentForm = React.forwardRef(
  (
    {
      fileNode,
      fileType,
      fileName,
      fileDescription,
      versionStatus,
      isAdmin,
      handleSubmit,
      submitButtons,
      showFieldHints = true,
      studyFiles,
    },
    ref,
  ) => {
    const [onUploading, setUploading] = useState(false);

    const options = Object.keys(versionState).map(state => ({
      key: state,
      value: state,
      text: versionState[state].title,
      content: <Badge state={state} />,
    }));
    return (
      <Formik
        initialValues={{
          file_name: fileName,
          file_type: fileType,
          file_desc: fileDescription,
          file_status: versionStatus,
        }}
        validate={vals => validate(vals, fileNode, studyFiles)}
        onSubmit={values => {
          setUploading(true);
          handleSubmit(...Object.values(values));
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
        }) => (
          <>
            {showFieldHints &&
              errors.file_name &&
              (errors.file_name.existing_similarity ||
                errors.file_name.upload_similarity) && (
                <ExistingDocsMessage
                  errors={errors}
                  existingDocs={studyFiles}
                  fileNameInput={values.file_name}
                />
              )}
            <Form onSubmit={handleSubmit} ref={ref}>
              <Form.Field required>
                <label htmlFor="file_name">Document Title:</label>
                <Form.Input
                  data-testid="name-input"
                  type="text"
                  name="file_name"
                  placeholder="Phenotypic Data manifest for..."
                  value={values.file_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    errors.file_name &&
                    Object.values(errors.file_name).some(x => x != null)
                  }
                />
                {showFieldHints && <TitleHints errors={errors} />}
              </Form.Field>
              {versionStatus && (
                <Form.Field>
                  <label>Approval Status:</label>
                  {isAdmin ? (
                    <Dropdown
                      selection
                      fluid
                      name="file_status"
                      options={options}
                      value={values.file_status}
                      placeholder="Choose an option"
                      onChange={(e, {value}) => {
                        setFieldValue('file_status', value);
                      }}
                    />
                  ) : (
                    <Badge state={versionStatus} />
                  )}
                </Form.Field>
              )}

              <Form.Field required>
                <label htmlFor="file_type">Document Type:</label>
                {Object.keys(fileTypeDetail).map(item => (
                  <Form.Field key={item}>
                    <Field
                      component={SelectElement}
                      name="file_type"
                      id={item}
                      label={item}
                    />
                  </Form.Field>
                ))}
              </Form.Field>

              <Form.Field required>
                <label>Describe Document Contents:</label>
                <TextArea
                  data-testid="description-input"
                  type="text"
                  name="file_desc"
                  value={values.file_desc}
                  onChange={handleChange}
                />
              </Form.Field>
              {submitButtons &&
                submitButtons(
                  Object.values(values).every(x => Boolean(x !== undefined)),
                  onUploading,
                )}
            </Form>
          </>
        )}
      </Formik>
    );
  },
);

EditDocumentForm.propTypes = {
  /** The title of the file */
  fileName: PropTypes.string,
  /** The description for the file */
  fileDescription: PropTypes.string,
  /** The value of the currently selected fileType's enum */
  fileType: PropTypes.string,
  /** The file approval status */
  versionStatus: PropTypes.string,
  /** If the user has ADMIN role */
  isAdmin: PropTypes.bool.isRequired,
  /** (New file) Function to perform on form submission  */
  handleSubmit: PropTypes.func,
  /** (New file) Any errors that occured when submitting the form */
  errors: PropTypes.string,
  /** (New file) Displays as buttons for form submitting */
  submitButtons: PropTypes.func,
  /** show validation hints */
  showFieldHints: PropTypes.Boolean,
};

export default EditDocumentForm;
