import React, {useState} from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Table,
} from 'semantic-ui-react';
import documentSelection from '../../../assets/selection.svg';

const DocRow = ({document, selected, setDocument}) => (
  <Table.Row onClick={() => setDocument(document)} className="cursor-pointer">
    <Table.Cell>
      <Icon name="file" /> {document.name + ' '}
      {selected === document.kfId && <Icon name="check" color="green" />}
    </Table.Cell>
    <Table.Cell textAlign="right">
      <code>{document.kfId}</code>
    </Table.Cell>
  </Table.Row>
);

const DocumentChooser = ({selected, documents, setDocument}) => {
  const [searchString, setSearch] = useState('');

  if (searchString) {
    documents = documents.filter(({node}) => node.name.includes(searchString));
  }

  return (
    <Table stackable selectable compact color="blue">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="2">
            <Form.Input
              fluid
              aria-label="file-search-input"
              icon="search"
              placeholder="Search by name, description or ID"
              onChange={(e, {value}) => setSearch(value)}
              value={searchString}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map(({node}) => (
          <DocRow
            key={node.id}
            selected={selected}
            document={node}
            setDocument={setDocument}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

const ChooseDocumentStep = ({
  values,
  setFieldValue,
  studyFiles,
  nextStep,
  previousStep,
}) => (
  <>
    <Grid.Row>
      <Grid.Column width={4}>
        <Image src={documentSelection} size="medium" centered rounded />
        <Header>Choose Document</Header>
        <p>
          Choose a document from the study to add this file to. The file will be
          uploaded as the latest version of the document.
        </p>
      </Grid.Column>
      <Grid.Column width={12}>
        <Form.Field required>
          <Header>Choose Document to Update</Header>
          <DocumentChooser
            documents={studyFiles}
            selected={values.doc && values.doc.kfId}
            setDocument={v => setFieldValue('doc', v)}
          />
        </Form.Field>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column textAlign="right" width={16}>
        <Button content="Back" onClick={previousStep} />
        <Button primary content="Next" onClick={nextStep} />
      </Grid.Column>
    </Grid.Row>
  </>
);

export default ChooseDocumentStep;
