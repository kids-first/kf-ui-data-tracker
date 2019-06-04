import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import {Button} from 'kf-uikit';
import Modal from '../../components/Modal/Modal';
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

  // Handle first step by saving file and progressing the step counter
  const handleFile = file => {
    setFile(file);
    setStep(1);
  };

  // Handle the version upload mutation
  const handleSave = props => {
    createVersion({
      variables: {file, fileId: match.params.fileId, description},
    })
      .then(resp => handleClose())
      .catch(err => setErrors(err));
  };

  // The different steps and their corresponding components
  const steps = {
    0: <UploadStep handleUpload={handleFile} />,
    1: <DescriptionStep file={file} handleDescription={setDescription} />,
  };

  return (
    <Modal
      title={`Upload Document Version: ${fileNode.name}`}
      onCloseModal={handleClose}
    >
      {steps[step]}
      {additionalContent && additionalContent()}
      {step === 1 && (
        <Button onClick={handleSave} disabled={!description || !file}>
          Upload
        </Button>
      )}
      {errors && <span className="text-red">{errors.message}</span>}
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
