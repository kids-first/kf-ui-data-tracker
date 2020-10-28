import React, {useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {
  Button,
  Divider,
  Form,
  Header,
  Icon,
  Message,
  Segment,
  Table,
} from 'semantic-ui-react';
import {Formik} from 'formik';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import {draftToMarkdown} from 'markdown-draft-js';

const DocRow = ({document, setStep, setDocument}) => (
  <Table.Row onClick={() => setDocument(document)}>
    <Table.Cell>
      <Icon name="file" /> {document.name}
    </Table.Cell>
    <Table.Cell textAlign="right">
      <code>{document.kfId}</code>
    </Table.Cell>
  </Table.Row>
);

const DocumentChooser = ({documents, setDocument}) => {
  const [searchString, setSearch] = useState('');

  if (searchString) {
    documents = documents.filter(({node}) => node.name.includes(searchString));
  }

  return (
    <Table stackable selectable compact color="blue">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Select a Document from the Study to Update
          </Table.HeaderCell>
          <Table.HeaderCell>
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
          <DocRow key={node.id} document={node} setDocument={setDocument} />
        ))}
      </Table.Body>
    </Table>
  );
};

const NewVersionForm = ({
  values,
  errors,
  touched,
  isSubmitting,
  isValid,
  handleBlur,
  handleChange,
  handleSubmit,
  version,
  setFieldValue,
  setFieldTouched,
  studyFiles,
  setShowDialog,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );

  return (
    <>
      <Divider />

      <Form.Field required>
        <Header>Choose Document to Update</Header>
        {!values.doc ? (
          <DocumentChooser
            documents={studyFiles}
            setDocument={v => setFieldValue('doc', v)}
          />
        ) : (
          <Message icon>
            <Icon name="file" />
            <Message.Content>
              <Button
                icon
                floated="right"
                labelPosition="left"
                onClick={() => setFieldValue('doc', null)}
              >
                <Icon name="refresh" />
                Select a Different Document
              </Button>
              <Message.Header>Document to Update:</Message.Header>
              {values.doc.name}
            </Message.Content>
          </Message>
        )}
      </Form.Field>

      {values.doc && (
        <Form.Field required>
          <Header>Change Description</Header>
          <p>
            Help the DRC determine how changes to this document may impact how
            the file is processed by noting any changes to the overall shape of
            the data or updates to the contents.
          </p>
          <Segment
            color={touched.description && errors.description ? 'red' : null}
          >
            <MarkdownEditor
              editorState={editorState}
              onEditorStateChange={e => {
                setFieldTouched('description');
                setEditorState(e);
                const rawState = convertToRaw(e.getCurrentContent());
                const mdText = draftToMarkdown(rawState);
                setFieldValue('description', mdText);
              }}
            />
          </Segment>
        </Form.Field>
      )}

      {values.doc && (
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
              data-testid="new-version-submit"
              type="submit"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              onClick={() => isValid && logEvent('click')}
            >
              Create
            </Button>
          )}
        </Amplitude>
      )}
    </>
  );
};

const FormikWrapper = ({handleSubmit, studyFiles}, ...props) => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'new version form']
        : ['new version form'],
    })}
  >
    <Formik
      initialValues={{
        doc: null,
        description: '',
      }}
      validate={vals => {
        let errors = {};
        if (vals.description.length <= 1) errors.description = 'required';
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <NewVersionForm {...props} {...formikProps} studyFiles={studyFiles} />
        </Form>
      )}
    </Formik>
  </Amplitude>
);

export default FormikWrapper;
