import PropTypes from 'prop-types';
import {useMutation} from '@apollo/client';
import {draftToMarkdown} from 'markdown-draft-js';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Button, Modal, Message, Icon} from 'semantic-ui-react';
import UploadStep from './UploadStep';
import {CREATE_FLATFILE_SETTINGS, CREATE_VERSION} from '../../mutations';
import React, {useEffect, useState} from 'react';
import {formFile, processExcel} from '../../../common/treeDataUtils';
import DescriptionStep from './DescriptionStep';
import {GET_FILE_BY_ID} from '../../queries';
import {ALL_EVENTS} from '../../../state/queries';
import NewExperienceStep from './NewExperienceStep';

/**
 * The NewVersionFlow handles flow for uploading a new version of a file
 */
export const NewVersionFlow = ({
  match,
  fileNode,
  additionalContent,
  handleClose,
}) => {
  const [flatfileSettings, setFlatfileSettings] = useState('');
  const [source, setSource] = useState(null);

  const [createFlatfileSettings] = useMutation(CREATE_FLATFILE_SETTINGS);
  const selectedTemplate = fileNode.templateVersion
    ? [fileNode.templateVersion.id]
    : [];

  useEffect(() => {
    if (flatfileSettings.length === 0) {
      createFlatfileSettings({
        variables: {
          templateVersions: selectedTemplate,
        },
      })
        .then(resp => {
          if (resp.data.createFlatfileSettings.flatfileSettings) {
            setFlatfileSettings(
              resp.data.createFlatfileSettings.flatfileSettings,
            );
          }
        })
        .catch(err => {
          console.log(err);
          const errorMessage = err.message
            ? err.message
            : 'Problem creating flatfile settings';
          setFlatfileSettings('ERROR: ' + errorMessage);
        });
    }
  }, [createFlatfileSettings, flatfileSettings.length, selectedTemplate]);

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
    var read = new FileReader();
    read.readAsBinaryString(file);
    read.onloadend = function() {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSource(processExcel(read.result));
      } else if (file.name.endsWith('.tsv') || file.name.endsWith('.csv')) {
        setSource(read.result);
      }
    };
  };

  // Handle the version upload mutation
  const handleSave = (overwriteOld, mappedData) => {
    setUploading(true);
    const rawState = convertToRaw(description.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    if (mappedData === 'directSubmit') {
      createVersion({
        variables: {file, fileId: match.params.fileId, description: mdText},
      })
        .then(resp => {
          handleClose();
          setUploading(false);
          window.location.reload(false);
        })
        .catch(err => setErrors(err));
    } else {
      if (!overwriteOld) {
        createVersion({
          variables: {
            file,
            fileId: match.params.fileId,
            description: 'Original Version:  ' + mdText,
          },
        })
          .then(resp => {
            const fileName = file.name || 'data.csv';
            const fileObj = formFile(fileName, mappedData);
            createVersion({
              variables: {
                file: fileObj,
                fileId: match.params.fileId,
                description: 'Mapped Version:  ' + mdText,
              },
            })
              .then(resp => {
                handleClose();
                setUploading(false);
                window.location.reload(false);
              })
              .catch(err => setErrors(err));
          })
          .catch(err => setErrors(err));
      } else {
        const fileName = file.name || 'data.csv';
        const fileObj = formFile(fileName, mappedData);
        createVersion({
          variables: {
            file: fileObj,
            fileId: match.params.fileId,
            description: 'Mapped Version:  ' + mdText,
          },
        })
          .then(resp => {
            handleClose();
            setUploading(false);
            window.location.reload(false);
          })
          .catch(err => setErrors(err));
      }
    }
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
    2: (
      <NewExperienceStep
        flatfileSettings={flatfileSettings}
        createVersion={createVersion}
        handleSave={handleSave}
        source={source}
        onUploading={onUploading}
        fileName={file ? file.name : ''}
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
        {step > 0 && (
          <Button
            icon
            labelPosition="left"
            floated="left"
            size="mini"
            onClick={() => {
              setStep(step - 1);
            }}
          >
            <Icon name="arrow left" />
            Back
          </Button>
        )}
        {step < 2 && (
          <Button
            icon
            primary
            disabled={step === 0 || !mdText || !file || onUploading}
            labelPosition="right"
            size="mini"
            onClick={() => {
              setStep(2);
            }}
          >
            <Icon name="arrow right" />
            Next
          </Button>
        )}
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
