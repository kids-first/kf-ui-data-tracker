import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {useMutation} from '@apollo/client';
import {draftToMarkdown} from 'markdown-draft-js';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Button, Modal, Message, Icon} from 'semantic-ui-react';
import UploadStep from './UploadStep';
import DescriptionStep from './DescriptionStep';
import {GET_FILE_BY_ID} from '../../queries';
import {CREATE_VERSION} from '../../mutations';
import {ALL_EVENTS} from '../../../state/queries';

/**
 * The NewVersionFlow handles flow for uploading a new version of a file
 */
export const NewVersionFlow = ({
  match,
  fileNode,
  additionalContent,
  handleClose,
}) => {
  const [createVersion] = useMutation(CREATE_VERSION, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {query: GET_FILE_BY_ID, variables: {kfId: match.params.fileId}},
      {
        query: ALL_EVENTS,
        variables: {
          fileId: fileNode.kfId,
          orderBy: '-created_at',
          first: 20,
        },
      },
    ],
  });

  // The current step that the flow is on
  const [step, setStep] = useState(0);
  // To keep track of the selected file
  const [file, setFile] = useState();
  // Hold the version change description
  const [description, setDescription] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );
  // For any errors that occur during upload
  const [errors, setErrors] = useState();
  // For the uploading stage
  const [onUploading, setUploading] = useState(false);

  const rawState = convertToRaw(description.getCurrentContent());
  const mdText = draftToMarkdown(rawState);

  // Handle first step by saving file and progressing the step counter
  const handleFile = file => {
    setFile(file);
    setStep(1);
  };

  // Handle the version upload mutation
  const handleSave = props => {
    // setUploading(true);
    // const rawState = convertToRaw(description.getCurrentContent());
    // const mdText = draftToMarkdown(rawState);
    createVersion({
      variables: {file, fileId: match.params.fileId, description: mdText},
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
    1: (
      <DescriptionStep
        file={file}
        description={description}
        handleDescription={setDescription}
      />
    ),
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
        {errors && (
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={errors.message}
          />
        )}
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
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'upload button']
              : ['button', 'upload button'],
          })}
        >
          {({logEvent}) => (
            <Button
              primary
              icon
              labelPosition="left"
              size="mini"
              disabled={step === 0 || !mdText || !file || onUploading}
              onClick={e => {
                logEvent('click');
                handleSave(e);
              }}
            >
              <Icon name="upload" />
              {onUploading ? 'UPLOADING ...' : 'UPLOAD'}
            </Button>
          )}
        </Amplitude>
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
};

// TODO: Update the cache instead of refetching the query
export default NewVersionFlow;
