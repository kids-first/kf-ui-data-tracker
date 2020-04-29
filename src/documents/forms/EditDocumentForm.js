/* eslint-disable  no-useless-escape */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, Dropdown, Segment} from 'semantic-ui-react';
import {Formik, Field} from 'formik';
import validate from './validate';
import ExistingDocsMessage from './ExistingDocsMessage';
import SelectElement from '../components/FileDetail/SelectElement';
import Badge from '../../components/Badge/Badge';
import UploadWizard from '../modals/UploadWizard/UploadWizard';
import {fileTypeDetail, versionState} from '../../common/enums';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import draftToMarkdown from 'draftjs-to-markdown';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
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
      history,
      handleSubmit,
      submitButtons,
      studyFiles,
    },
    ref,
  ) => {
    const [onUploading, setUploading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [titleError, setTitleError] = useState({});
    const [editorState, setEditorState] = useState(
      EditorState.createWithContent(
        ContentState.createFromText(fileDescription || ''),
      ),
    );
    const options = ['PEN', 'APP', 'CHN', 'PRC'].map(state => ({
      key: state,
      value: state,
      text: versionState[state].title,
      content: <Badge state={state} />,
    }));
    return (
      <>
        <Formik
          initialValues={{
            file_name: fileName || '',
            file_type: fileType,
            file_desc: fileDescription,
            file_status: versionStatus,
          }}
          validate={vals => {
            setTitleError(validate(vals, fileNode, studyFiles));
            let errors = {};
            ['file_name', 'file_type'].forEach(function(field) {
              if (!vals[field]) {
                errors[field] = 'Required';
              }
            });
            const rawState = convertToRaw(editorState.getCurrentContent());
            const mdText = draftToMarkdown(rawState);
            if (mdText.length < 3) {
              errors.file_desc = 'Required';
            }
            return errors;
          }}
          onSubmit={values => {
            setUploading(true);
            const rawState = convertToRaw(editorState.getCurrentContent());
            const mdText = draftToMarkdown(rawState);
            var submitValue = values;
            submitValue.file_desc = mdText;
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
            validateForm,
          }) => (
            <>
              {titleError.file_name &&
                (titleError.file_name.existing_similarity ||
                  titleError.file_name.exact_matches ||
                  titleError.file_name.upload_similarity) && (
                  <ExistingDocsMessage
                    setShowDialog={setShowDialog}
                    errors={titleError}
                    existingDocs={studyFiles}
                    fileNameInput={values.file_name}
                    newFile={!versionStatus}
                  />
                )}
              <Form onSubmit={handleSubmit} ref={ref}>
                <Form.Field required>
                  <label htmlFor="file_name">Document Title:</label>
                  <input
                    className={
                      touched.file_name && errors.file_name
                        ? 'border-red'
                        : null
                    }
                    data-testid="name-input"
                    type="text"
                    name="file_name"
                    placeholder="Phenotypic Data manifest for..."
                    value={values.file_name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <small>
                    Please provide a descriptive title without dates or
                    adjectives such as "new", "updated", "final", etc.
                  </small>
                </Form.Field>
                {versionStatus && (
                  <Form.Field>
                    <label>Approval Status:</label>
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
                {submitButtons && (
                  <Form.Field required>
                    <label>Describe Document Contents:</label>
                    <Segment
                      className={
                        touched.file_desc && errors.file_desc
                          ? 'border-red'
                          : null
                      }
                    >
                      <MarkdownEditor
                        editorState={editorState}
                        onEditorStateChange={e => {
                          setEditorState(e);
                          validateForm();
                        }}
                      />
                    </Segment>
                  </Form.Field>
                )}
                {submitButtons &&
                  submitButtons(
                    Object.keys(errors).length > 0 ||
                      values.file_name.length === 0,
                    onUploading,
                  )}
              </Form>
            </>
          )}
        </Formik>
        {showDialog && (
          <UploadWizard
            startingStep={1}
            studyId={history.location.pathname.split('/')[2]}
            onCloseDialog={() => {
              setShowDialog(false);
            }}
            file={fileNode}
            fileList={studyFiles}
            history={history}
          />
        )}
      </>
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
  handleSubmit: PropTypes.func,
  /** (New file) Any errors that occured when submitting the form */
  errors: PropTypes.object,
  /** (New file) Displays as buttons for form submitting */
  submitButtons: PropTypes.func,
};

export default EditDocumentForm;
