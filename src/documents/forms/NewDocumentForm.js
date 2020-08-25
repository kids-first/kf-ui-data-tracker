import React, {useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {
  Button,
  Divider,
  Form,
  Header,
  Icon,
  Input,
  Message,
  Segment,
} from 'semantic-ui-react';
import {Formik, Field} from 'formik';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import SelectElement from '../components/FileDetail/SelectElement';
import draftToMarkdown from 'draftjs-to-markdown';

import {fileTypeDetail} from '../../common/enums';
import {urls} from '../../common/urls';

const NewDocumentForm = ({
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
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );

  return (
    <>
      <Form.Field required>
        <Header>Document Type</Header>
        <p>
          Help the DRC understand the purpose of this document by classifying it
          as the appropriate type.
        </p>
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
        <Message icon>
          <Icon name="info circle" />
          <Message.Content>
            <Message.Header>Does not Qualify</Message.Header>
            This file does not meet requirements for any of the expedited types.
            If you'd like to have this file processed faster, please consider
            formatting the file according to one of the{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={urls.expeditedFiles}
            >
              file types
            </a>
            .
          </Message.Content>
        </Message>
      </Form.Field>

      <Divider />

      <Form.Field error={touched.file_name && !!errors.file_name} required>
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
        {errors.file_name === 'exists' && (
          <Message
            negative
            icon="warning"
            header="Document Already Exists"
            content="A document with this name already exists in the study. Consider updating the existing document instead of creating a new document"
          />
        )}
        <small>
          Please provide a descriptive title without dates or adjectives such as
          "new", "updated", "final", etc.
        </small>
      </Form.Field>

      <Divider />

      <Form.Field required>
        <Header>Description</Header>
        <Segment color={touched.file_desc && errors.file_desc ? 'red' : null}>
          <MarkdownEditor
            editorState={editorState}
            onEditorStateChange={e => {
              setFieldTouched('file_desc');
              setEditorState(e);
              const rawState = convertToRaw(e.getCurrentContent());
              const mdText = draftToMarkdown(rawState);
              setFieldValue('file_desc', mdText);
            }}
          />
        </Segment>

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
              data-testid="new-file-submit"
              type="submit"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              onClick={() => isValid && logEvent('click')}
            >
              Create
            </Button>
          )}
        </Amplitude>
      </Form.Field>
    </>
  );
};

const FormikWrapper = ({handleSubmit, studyFiles}, ...props) => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'new document form']
        : ['new document form'],
    })}
  >
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
        if (
          vals.file_name &&
          studyFiles.filter(
            ({node}) =>
              node.name.toLowerCase() === vals.file_name.toLowerCase(),
          ).length > 0
        ) {
          errors.file_name = 'exists';
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <NewDocumentForm
            {...props}
            {...formikProps}
            studyFiles={studyFiles}
          />
        </Form>
      )}
    </Formik>
  </Amplitude>
);

export default FormikWrapper;
