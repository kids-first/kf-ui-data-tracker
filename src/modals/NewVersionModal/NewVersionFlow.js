import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import {Button, Modal, Message, Icon} from 'semantic-ui-react';
import UploadStep from './UploadStep';
import DescriptionStep from './DescriptionStep';
import {GET_FILE_BY_ID} from '../../state/queries';
import {CREATE_VERSION} from '../../state/mutations';

/**
 * The NewVersionFlow handles flow for uploading a new version of a file
 */
export const NewVersionFlow = ({
  match,
  fileNode,
  additionalContent,
  handleClose,
  createVersion,
}) => {
  // The current step that the flow is on
  const [step, setStep] = useState(0);
  // To keep track of the selected file
  const [file, setFile] = useState();
  // Hold the version change description
  const [description, setDescription] = useState();
  // For any errors that occur during upload
  const [errors, setErrors] = useState();
  // For the uploading stage
  const [onUploading, setUploading] = useState(false);

  // Handle first step by saving file and progressing the step counter
  const handleFile = file => {
    setFile(file);
    setStep(1);
  };

  // Handle the version upload mutation
  const handleSave = props => {
    setUploading(true);
    createVersion({
      variables: {file, fileId: match.params.fileId, description},
    })
      .then(resp => {
        handleClose();
        setUploading(false);
      })
      .catch(err => setErrors(err));
  };

  // The different steps and their corresponding components
  const steps = {
    0: <UploadStep handleUpload={handleFile} />,
    1: <DescriptionStep file={file} handleDescription={setDescription} />,
  };

  return (
    <Modal open={true} onClose={handleClose} size="small" closeIcon>
      <Modal.Header
        content={
          step === 1
            ? `Summarize Your Changes: ${fileNode.name}`
            : `Upload Document Version: ${fileNode.name}`
        }
      />
      <Modal.Content scrolling>
        {steps[step]}
        {additionalContent && additionalContent()}
        {errors && <Message negative>{errors.message}</Message>}
      </Modal.Content>
      <Modal.Actions>
        {step === 1 && (
          <Button
            icon
            labelPosition="left"
            floated="left"
            size="mini"
            onClick={() => {
              setStep(0);
            }}
          >
            <Icon name="arrow left" />
            Back to Upload
          </Button>
        )}
        <Button
          primary
          icon
          labelPosition="left"
          size="mini"
          disabled={step === 0 || !description || !file || onUploading}
          onClick={handleSave}
        >
          <Icon name="upload" />
          {onUploading ? 'UPLOADING ...' : 'UPLOAD'}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

NewVersionFlow.propTypes = {
  /** The file that the new version is being created for */
  fileNode: PropTypes.object.isRequired,
  /** Any additional content to display at the footer */
  additionalContent: PropTypes.func,
  /** Function to be called when the modal should be closed */
  handleClose: PropTypes.func.isRequired,
  /** Mutation that will upload and create the version */
  createVersion: PropTypes.func.isRequired,
};

// TODO: Update the cache instead of refetching the query
export default graphql(CREATE_VERSION, {
  name: 'createVersion',
  options: ({match}) => ({
    awaitRefetchQueries: true,
    refetchQueries: [
      {query: GET_FILE_BY_ID, variables: {kfId: match.params.fileId}},
    ],
  }),
})(NewVersionFlow);
