import React, {useState} from 'react';
import PropTypes from 'prop-types';
import SelectElement from '../components/FileAnnotation/SelectElement';
import Badge from '../components/Badge/Badge';
import {fileTypeDetail, versionState} from '../common/fileUtils';
import {Form, TextArea, Dropdown} from 'semantic-ui-react';
/**
 * Form to edit document information or annotate new file for uploading
 */
const EditDocumentForm = ({
  fileType,
  fileName,
  fileDescription,
  versionStatus,
  onFileTypeChange,
  onNameChange,
  onDescriptionChange,
  isAdmin,
  onVersionStatusChange,
  handleSubmit,
  errors,
  submitButtons,
}) => {
  const [newFileType, setFileType] = useState();
  const [newFileName, setFileName] = useState();
  const [newFileDescription, setFileDescription] = useState();
  const [onUploading, setUploading] = useState(false);
  const options = Object.keys(versionState).map(state => ({
    key: state,
    value: state,
    text: versionState[state].title,
    content: <Badge state={state} />,
  }));
  return (
    <Form
      onSubmit={ev => {
        if (handleSubmit) {
          setUploading(true);
          ev.preventDefault();
          handleSubmit(newFileName, newFileType, newFileDescription);
        }
      }}
    >
      <Form.Field required>
        <label htmlFor="file_title">Document Title:</label>
        <input
          data-testid="name-input"
          type="text"
          name="file_name"
          placeholder="Phenotypic Data manifest for..."
          defaultValue={fileName}
          onChange={e => {
            onNameChange ? onNameChange(e) : setFileName(e.target.value);
          }}
        />
      </Form.Field>
      {versionStatus && (
        <Form.Field>
          <label>Approval Status:</label>
          {isAdmin ? (
            <Dropdown
              selection
              fluid
              options={options}
              value={versionStatus}
              placeholder="Choose an option"
              onChange={(e, {value}) => {
                onVersionStatusChange(value);
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
            <SelectElement
              value={item}
              selected={
                onFileTypeChange ? fileType === item : newFileType === item
              }
              select={value => {
                if (isAdmin) {
                  onFileTypeChange
                    ? onFileTypeChange(value)
                    : setFileType(item);
                }
              }}
            />
          </Form.Field>
        ))}
      </Form.Field>
      <Form.Field required>
        <label>Describe Document Contents:</label>
        <TextArea
          data-testid="description-input"
          type="text"
          name="description"
          defaultValue={fileDescription}
          onChange={e => {
            onDescriptionChange
              ? onDescriptionChange(e)
              : setFileDescription(e.target.value);
          }}
        />
      </Form.Field>
      {submitButtons &&
        submitButtons(
          !newFileName || !newFileType || !newFileDescription || onUploading,
          onUploading,
        )}
    </Form>
  );
};

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
  isAdmin: PropTypes.bool,
  /** Action to perform when name input is updated */
  onNameChange: PropTypes.func,
  /** Action to perform when description input is updated */
  onDescriptionChange: PropTypes.func,
  /** Action to perform when fileType input is updated */
  onFileTypeChange: PropTypes.func,
  /** Action to perform when file approval status is updated */
  onVersionStatusChange: PropTypes.func,
  /** (New file) Function to perform on form submission  */
  handleSubmit: PropTypes.func,
  /** (New file) Any errors that occured when submitting the form */
  errors: PropTypes.string,
  /** (New file) Displays as buttons for form submitting */
  submitButtons: PropTypes.func,
};

export default EditDocumentForm;
