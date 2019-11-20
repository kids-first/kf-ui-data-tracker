import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Table} from 'semantic-ui-react';
import {LogOnMount} from '@amplitude/react-amplitude';
import {
  AmplitudeProxy,
  withAnalyticsTracking,
} from '../../../../analyticsTracking';
import {sortFilesBySimilarity} from '../../../utilities';

const DocRow = withAnalyticsTracking(
  ({document, setStep, setFileToUpdate, tracking: {buttonTracking}}) => {
    const isSimilar = document.rating >= 0.9;
    return (
      <Table.Row
        style={{background: isSimilar ? '#f8ffff' : 'inherit'}}
        data-testid={isSimilar ? 'similar-document-item' : 'document-item'}
        onClick={() => {
          buttonTracking(document.name, 'Table.Row', {}, 'File row').onClick();
          setFileToUpdate(document);
          setStep(2);
        }}
      >
        <Table.Cell>
          <Icon name="file" /> {document.name}
        </Table.Cell>
      </Table.Row>
    );
  },
);

const SimilarDocumentsTable = ({documents, setStep, setFileToUpdate}) => (
  <Table stackable selectable compact color="blue">
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Select a Study Document to Update</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {documents.map(doc => (
        <DocRow
          document={doc}
          setStep={setStep}
          setFileToUpdate={setFileToUpdate}
        />
      ))}
    </Table.Body>
  </Table>
);

/**
 * Step 1 in multi-step upload document modal.
 * Allows users to select study documents based on the
 * string similarity of file names
 */
const DocumentSelectionStep = ({
  fileList,
  file,
  setStep,
  setFileToUpdate,
  trackingProperties,
}) => {
  // find bestMatches for filename's similar to the uploaded document
  const fileMatches = sortFilesBySimilarity(file, fileList);

  return (
    <AmplitudeProxy eventProperties={trackingProperties}>
      {({EVENT_CONSTANTS: {UPLOAD_WIZARD}}) => (
        <>
          <LogOnMount
            eventType={`${UPLOAD_WIZARD.STEP}_1`}
            eventProperties={trackingProperties}
          />
          <p>
            Adding changes to existing documents in your study? You can rest
            easy knowing that any previous versions of your documents are
            automatically archived, and available to you for easy
            download/review at any time.
          </p>
          <SimilarDocumentsTable
            documents={fileMatches.ranked_files}
            setStep={setStep}
            setFileToUpdate={setFileToUpdate}
          />
        </>
      )}
    </AmplitudeProxy>
  );
};

DocumentSelectionStep.propTypes = {
  /** The file that the document is being created or updated for */
  file: PropTypes.object.isRequired,
  /** Array of file nodes for current study  */
  fileList: PropTypes.array.isRequired,
  /** Function to advance multi-step modal to the next step  */
  setStep: PropTypes.func.isRequired,
  /** function to store the uploaded file in local state */
  setFileToUpdate: PropTypes.func.isRequired,
};

export default DocumentSelectionStep;
