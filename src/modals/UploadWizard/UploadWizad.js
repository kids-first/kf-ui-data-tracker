import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Modal, Icon, Message } from 'semantic-ui-react';
import ChooseMethodStep from './ChooseMethodStep';
import ExistingDocuentSelectionStep from './ExistingDocuentSelectionStep'
import VersionSummaryStep from './VersionSummaryStep';
import * as stringSimilarity from 'string-similarity';


const UPLOAD_STEPS = {
  0: {
    title: 'Choose an Upload Method',
    comp: ChooseMethodStep,
  },
  1: {
    title: 'Update Existing Study Document',
    comp: ExistingDocuentSelectionStep
  },
  2: {
    title: 'Summarize Your Update',
    comp: VersionSummaryStep,
  }
}

/** Multi-step modal for uplaoding new documents as files versions or creating new documents */
const UploadWizard = ({ onCloseDialog, history, file, fileList }) => {
  // The current step that the flow is on
  const [step, setStep] = useState(0);
  const [fileToUpdate, setFileToUpdate] = useState(null);


  const MIN_SIMILIRATIY = 0.3;
  // find bestMatches for filename's similar to the uploaded document
  const fileMatches = stringSimilarity.findBestMatch(file.name || '', fileList.length ? fileList.map(x => x.node.name) : [])
  // sort bestMatches by rating descending
  const similarDocuments = fileMatches.ratings.filter(f => f.rating > MIN_SIMILIRATIY).sort((a, b) => (a.rating > b.rating) ? 1 : -1).reverse();


  return (
    <Modal open={true} onClose={() => { setStep(0); onCloseDialog() }} closeIcon>

      <Header>
        <Header.Subheader as='h2'><Icon name="upload cloud" />Upload: {file.name}</Header.Subheader>
        {UPLOAD_STEPS[step].title}
      </Header>

      <Modal.Content >

        {similarDocuments.length && step < 2 ?
          <Message info size="mini" >
            <Icon name='info circle' />
            <strong>{similarDocuments.length}</strong> similar documents found
          </Message>
          : null}

        {UPLOAD_STEPS[step].comp({ history, file, fileList, setStep, setFileToUpdate, fileToUpdate })}


      </Modal.Content>

      <Modal.Actions>

        <Button
          icon
          labelPosition="left"
          floated="left"
          size="mini"
          onClick={() => {
            if (step === 0) {
              setStep(0);
              onCloseDialog();
            }
            setStep(step - 1);
          }}
        >
          <Icon name="arrow left" />
          Back
          </Button>

        <Button
          primary
          icon
          labelPosition="left"
          size="mini"
          disabled={step < 2 || !file}
        // onClick={handleSave}
        >
          <Icon name="upload cloud" />
          UPLOAD
        </Button>
      </Modal.Actions>

    </Modal >
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
}

export default UploadWizard;