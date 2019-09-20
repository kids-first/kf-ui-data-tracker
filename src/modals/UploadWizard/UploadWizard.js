import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Button, Header, Modal, Icon, Message} from 'semantic-ui-react';
import {
  ChooseMethodStep,
  DocumentSelectionStep,
  SuccessStep,
  VersionSummaryStep,
} from './UploadSteps';
import {graphql} from 'react-apollo';

import {GET_STUDY_BY_ID} from '../../state/queries';
import {CREATE_VERSION} from '../../state/mutations';
import {sortFilesBySimilarity} from '../../common/fileUtils';

// store all of our upload steps and their associated components
const UPLOAD_STEPS = {
  0: {
    title: 'Choose an Upload Method',
    comp: ChooseMethodStep,
  },
  1: {
    title: 'Update Existing Study Document',
    comp: DocumentSelectionStep,
  },
  2: {
    title: 'Summarize Your Update',
    comp: VersionSummaryStep,
  },
  3: {
    title: 'Document Updated',
    comp: SuccessStep,
  },
};

/** custom hook to set a 3 second timer  */
const useTimerHook = (isActive, onEnd) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds < 3) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (seconds >= 3) {
      clearInterval(interval);
      onEnd();
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onEnd]);

  return seconds;
};

/** Multi-step modal for uplaoding files as document versions or creating new documents */
const UploadWizard = ({
  createVersion,
  onCloseDialog,
  history,
  file,
  fileList,
  studyId,
}) => {
  // The current step that the flow is on
  const [step, setStep] = useState(0);
  // store the selected study file to create version for
  const [fileToUpdate, setFileToUpdate] = useState(null);

  // TODO: set upload error state in ui
  // For any errors that occur during upload
  // const [errors, setErrors] = useState();

  // For the uploading stage
  const [onUploading, setUploading] = useState(false);
  // Hold the version change description
  const [description, setDescription] = useState();

  const similarDocuments = sortFilesBySimilarity(file, fileList);

  const handleCloseDialog = () => {
    onCloseDialog();
  };

  const [isTimerActive, setIsTimerActive] = useState(false);
  const seconds = useTimerHook(isTimerActive, handleCloseDialog);

  /** TODO: abstract to custom hook or external util */
  const handleSave = async props => {
    try {
      setUploading(true);
      await createVersion({
        variables: {file, fileId: fileToUpdate.kfId, description},
      });
      // TODO: maybe make this part of local state
      sessionStorage.setItem('kf_updated_docs', fileToUpdate.kfId);

      setUploading(false);
      setIsTimerActive(true);
      setStep(3);
    } catch (e) {
      console.error(e);
      setIsTimerActive(false);
      // setErrors(e)
    }
  };

  return (
    <Modal
      open={true}
      onClose={() => {
        handleCloseDialog();
      }}
      closeIcon
    >
      <Header>
        <Header.Subheader as="h2" data-testid="wizard-subhead">
          <Icon name="upload cloud" />
          Upload: {file.name}
        </Header.Subheader>
        {UPLOAD_STEPS[step].title}
      </Header>

      <Modal.Content>
        {similarDocuments.matches.length && step < 2 ? (
          <Message info size="mini">
            <Icon name="info circle" />
            <strong>{similarDocuments.matches.length}</strong> similar documents
            found
          </Message>
        ) : null}

        {UPLOAD_STEPS[step].comp({
          history,
          file,
          fileList,
          setStep,
          setFileToUpdate,
          fileToUpdate,
          setDescription,
          handleCloseDialog,
          isTimerActive,
          seconds,
        })}
      </Modal.Content>

      <Modal.Actions>
        <Button
          icon
          labelPosition="left"
          floated="left"
          size="mini"
          disabled={onUploading}
          onClick={() => {
            if (step === 0 || step === 3) {
              handleCloseDialog();
            }
            setStep(step - 1);
          }}
        >
          {step === 3 ? (
            <>
              <Icon name="x" />
              Close
            </>
          ) : (
            <>
              <Icon name="arrow left" /> Back{' '}
            </>
          )}
        </Button>

        <Button
          primary
          icon
          labelPosition="left"
          size="mini"
          disabled={step !== 2 || !file}
          data-testid="upload-button"
          onClick={handleSave}
        >
          <Icon name="upload cloud" />
          {onUploading ? 'UPLOADING ...' : 'UPLOAD'}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

UploadWizard.propTypes = {
  /** Function to be called when the modal should be closed */
  onCloseDialog: PropTypes.func.isRequired,
  /** The file that the document is being created or updated for */
  file: PropTypes.object.isRequired,
  /** Array of file nodes for current study  */
  fileList: PropTypes.array.isRequired,
  /** React-router hisotry object  */
  history: PropTypes.any,
  /** Mutation that will upload and create the version */
  createVersion: PropTypes.func.isRequired,
};

export default graphql(CREATE_VERSION, {
  name: 'createVersion',
  options: ({studyId}) => ({
    refetchQueries: [{query: GET_STUDY_BY_ID, variables: {kfId: studyId}}],
  }),
})(UploadWizard);

// export default UploadWizard;
