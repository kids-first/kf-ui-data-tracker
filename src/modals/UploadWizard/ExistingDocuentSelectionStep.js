import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import * as stringSimilarity from 'string-similarity';

const DocRow = ({ document, setStep, setFileToUpdate }) => {
  const isSimilar = document.rating > 0.3
  return (<Table.Row style={{ background: isSimilar ? '#f8ffff' : 'inherit' }} onClick={() => { setFileToUpdate(document); setStep(2); }} >
    <Table.Cell>
      <Icon name='file' />  {document.name}
    </Table.Cell>
  </Table.Row>
  )
}

const SimilarDocumentsTable = ({ documents, setStep, setFileToUpdate }) => (
  <Table stackable selectable compact color="blue" >
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Select a Study Document to Update</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {
        documents.reverse().map(doc => (
          <DocRow document={doc} setStep={setStep} setFileToUpdate={setFileToUpdate} />
        ))
      }
    </Table.Body>
  </Table >
)


const ExistingDocuentSelectionStep = ({ fileList, file, setStep, setFileToUpdate }) => {

  // find bestMatches for filename's similar to the uploaded document
  const fileMatches = stringSimilarity.findBestMatch(file.name || '', fileList.length ? fileList.map(x => x.node.name) : [])
  // sort all study files by bestMatches rating
  const updateDocumentsList = fileList.map(({ node }) => ({ rating: fileMatches.ratings.filter(({ target }) => target === node.name)[0].rating, ...node })).sort((a, b) => (a.rating > b.rating) ? 1 : -1)

  return (<>
    <p>Adding changes to existing documents in your study? You can rest easy knowing that any previous versions of your documents are automatically archived, and available to you for easy download/review at any time.</p>
    <SimilarDocumentsTable documents={updateDocumentsList} setStep={setStep} setFileToUpdate={setFileToUpdate} />
  </>
  )
};

export default ExistingDocuentSelectionStep;