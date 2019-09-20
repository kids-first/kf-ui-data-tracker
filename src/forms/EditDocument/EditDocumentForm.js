/* eslint-disable  no-useless-escape */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, TextArea, Dropdown} from 'semantic-ui-react';
import {Formik, Field} from 'formik';
import validate from './validate';
import ExistingDocsMessage from './ExistingDocsMessage';
import DocumentTitleValidationIndicators from './DocumentTitleValidationIndicators';
import SelectElement from '../../components/FileAnnotation/SelectElement';
import Badge from '../../components/Badge/Badge';
import UploadWizard from '../../modals/UploadWizard/UploadWizard';
import {fileTypeDetail, versionState} from '../../common/fileUtils';

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
      history,
      handleSubmit,
      submitButtons,
      showFieldHints,
      studyFiles,
    },
    ref,
  ) => {
    const [onUploading, setUploading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const options = Object.keys(versionState).map(state => ({
      key: state,
      value: state,
      text: versionState[state].title,
      content: <Badge state={state} />,
    }));
    return (
      <>
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
                    setShowDialog={setShowDialog}
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

                  <DocumentTitleValidationIndicators errors={errors} />
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
