import React, {useState} from 'react';
import {
  Button,
  Card,
  Container,
  Divider,
  Form,
  Header,
  Icon,
  Input,
  Message,
  Progress,
  Segment,
  Transition,
} from 'semantic-ui-react';
import {Formik, Field} from 'formik';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import SelectElement from '../components/FileDetail/SelectElement';
import draftToMarkdown from 'draftjs-to-markdown';

import {fileTypeDetail} from '../../common/enums';

const NewDocumentForm = ({
  values,
  errors,
  disabled,
  handleBlur,
  handleChange,
  handleSubmit,
  version,
  setFieldValue,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );
  return (
    <>
      <Form.Field required>
        <Header>Document Type</Header>
        <p>Classify the new document under the most correct type.</p>
        <Header size="small">General Types</Header>
        {Object.keys(fileTypeDetail).map(item => (
          <Form.Field key={item}>
            <Field
              component={SelectElement}
              name="file_type"
              id={item}
              label={item}
            />
          </Form.Field>
        ))}
        <Header size="small">Expedited Types</Header>
        <Container text>
          <Message icon>
            <Icon name="info circle" />
            <Message.Content>
              <Message.Header>Does not Qualify</Message.Header>
              This file does not meet requirements for any of the expedited
              types. If you'd like to have this file processed faster, please
              consider formatting the file according to one of the{' '}
              <a href="#">file types</a>.
            </Message.Content>
          </Message>
        </Container>
      </Form.Field>

      <Divider />

      <Form.Field required>
        <Header>Document Name</Header>
        <Input
          data-testid="name-input"
          type="text"
          name="file_name"
          placeholder="Phenotypic Data manifest for..."
          value={values.file_name}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <small>
          Please provide a descriptive title without dates or adjectives such as
          "new", "updated", "final", etc.
        </small>
      </Form.Field>

      <Divider />

      <Form.Field required>
        <Header>Description</Header>
        <Segment color={errors.file_desc ? 'red' : null}>
          <MarkdownEditor
            editorState={editorState}
            onEditorStateChange={e => {
              setEditorState(e);
              const rawState = convertToRaw(e.getCurrentContent());
              const mdText = draftToMarkdown(rawState);
              setFieldValue('file_desc', mdText);
            }}
          />
        </Segment>

        <Button
          primary
          data-testid="new-file-submit"
          floated="right"
          type="submit"
          disabled={disabled}
        >
          Create
        </Button>
      </Form.Field>
    </>
  );
};

const FormikWrapper = ({handleSubmit}, ...props) => {
  return (
    <Formik
      initialValues={{
        file_name: '',
        file_type: 'OTH',
        file_desc: '',
        file_status: 'PEN',
      }}
      validate={vals => {
        let errors = {};
        if (!vals.file_name) errors.file_name = 'required';
        if (!vals.file_desc.trim()) errors.file_desc = 'required';
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <NewDocumentForm {...props} {...formikProps} />
        </Form>
      )}
    </Formik>
  );
};

export default FormikWrapper;
