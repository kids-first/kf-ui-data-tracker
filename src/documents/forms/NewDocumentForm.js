import React, {useEffect, useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Form,
  Header,
  Icon,
  Input,
  Label,
  Message,
  Placeholder,
  Radio,
  Segment,
} from 'semantic-ui-react';
import {Formik, Field} from 'formik';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import draftToMarkdown from 'draftjs-to-markdown';

import {fileTypeDetail} from '../../common/enums';
import {urls} from '../../common/urls';

const TypeCardPlaceholder = props => (
  <Card>
    <Card.Content>
      <Label color="yellow" corner="right">
        <Icon name="star" />
      </Label>
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line length="medium" />
          <Placeholder.Line length="short" />
        </Placeholder.Paragraph>
      </Placeholder>
    </Card.Content>
  </Card>
);

const TypeCard = ({
  field: {name, onChange},
  form: {values, setFieldValue},
  id,
  expedited,
}) => (
  <Card
    color={id === values.file_type ? (expedited ? 'yellow' : 'blue') : 'grey'}
    onClick={() => {
      setFieldValue(name, id);
    }}
  >
    <Card.Content>
      {expedited && (
        <Label color="yellow" corner="right">
          <Icon name="star" />
        </Label>
      )}

      <Card.Header>
        <Radio
          name={name}
          id={id}
          value={id}
          checked={id === values.file_type}
          onChange={onChange}
          label={() => (
            <Icon
              name={fileTypeDetail[id].icon}
              size="large"
              bordered
              circular
              inverted
              color={
                id === values.file_type
                  ? expedited
                    ? 'yellow'
                    : 'blue'
                  : 'black'
              }
            />
          )}
        />
        {fileTypeDetail[id].title}
      </Card.Header>
      <Card.Description>{fileTypeDetail[id].description}</Card.Description>
    </Card.Content>
    {fileTypeDetail[id].url && (
      <Card.Content extra>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={fileTypeDetail[id].url}
        >
          More info
        </a>
      </Card.Content>
    )}
  </Card>
);

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

  const validTypes = Object.keys(fileTypeDetail).filter(k =>
    version.validTypes.includes(k),
  );

  const generalTypes = validTypes.filter(
    item => fileTypeDetail[item].requiredColumns.length === 0,
  );

  const expeditedTypes = validTypes.filter(
    item => fileTypeDetail[item].requiredColumns.length > 0,
  );

  useEffect(() => {
    // Set the default file type if it is not yet set
    if (expeditedTypes.length) {
      setFieldValue('file_type', expeditedTypes[0]);
    } else if (generalTypes.length) {
      setFieldValue('file_type', 'OTH');
    }
    setFieldTouched('file_type');
  }, [version]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Form.Field required>
        <Header>Document Type</Header>
        <p>
          Help the DRC understand the purpose of this document by classifying it
          as the appropriate type.
        </p>
        <Header size="small">
          <Icon name="shipping fast" />
          Expedited Types
        </Header>
        <Dimmer.Dimmable>
          {expeditedTypes.length ? (
            <Card.Group itemsPerRow={3}>
              {expeditedTypes.map(item => (
                <Field
                  expedited
                  component={TypeCard}
                  name="file_type"
                  id={item}
                  label={item}
                  key={item}
                />
              ))}
            </Card.Group>
          ) : (
            <Card.Group itemsPerRow={3}>
              <TypeCardPlaceholder />
              <TypeCardPlaceholder />
              <TypeCardPlaceholder />
            </Card.Group>
          )}
          <Dimmer active={!expeditedTypes.length} inverted>
            <Header size="small">No expedited types available</Header>
            <p>
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
            </p>
          </Dimmer>
        </Dimmer.Dimmable>
        <Header size="small">General Types</Header>
        <Card.Group itemsPerRow={3}>
          {generalTypes.map(item => (
            <Field
              component={TypeCard}
              name="file_type"
              id={item}
              label={item}
              key={item}
            />
          ))}
        </Card.Group>
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
      {errors.all && (
        <Message icon="warning" negative content={errors.all.message} />
      )}
    </>
  );
};

const FormikWrapper = ({handleSubmit, studyFiles, ...props}) => (
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
        file_type: null,
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
        <Form onSubmit={props => formikProps.handleSubmit(props, formikProps)}>
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
