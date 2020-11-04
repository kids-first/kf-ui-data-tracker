import React, {useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Form, Header, Message, Input, Segment} from 'semantic-ui-react';
import {Formik} from 'formik';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import MarkdownEditor from '../../documents/components/FileDetail/MarkdownEditor';
import {draftToMarkdown} from 'markdown-draft-js';
import {StudyTable} from '../components/StudyTable';
import {ServiceSelect} from '../components/ServiceSelect';

const NewReleaseForm = ({
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
  studies,
  services,
  history,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );

  const toggleStudy = study => {
    if (values.studies.filter(s => s.id === study.id).length) {
      setFieldValue(
        'studies',
        values.studies.filter(s => s.id !== study.id),
      );
    } else {
      setFieldValue('studies', [...values.studies, study]);
    }
  };
  const toggleService = service => {
    if (values.services.filter(s => s.id === service.id).length) {
      setFieldValue(
        'services',
        values.services.filter(s => s.id !== service.id),
      );
    } else {
      setFieldValue('services', [...values.services, service]);
    }
  };

  return (
    <Segment clearing>
      <Form.Field error={touched.title && !!errors.title} required>
        <Header>Title</Header>
        <Input
          data-testid="title-input"
          type="text"
          name="title"
          placeholder="New Study Participants"
          value={values.title}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </Form.Field>

      <Form.Field required>
        <Header>Description</Header>
        <Segment color={touched.file_desc && errors.file_desc ? 'red' : null}>
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

      <Form.Field>
        <Header>Choose Studies</Header>
        <StudyTable
          name="studies"
          selected={values.studies}
          studies={studies}
          value={values.studies}
          onBlur={handleBlur}
          onChange={toggleStudy}
        />
      </Form.Field>
      <Form.Field>
        <Header>Choose Tasks to Run</Header>
        <ServiceSelect
          name="services"
          selected={values.services}
          services={services}
          value={values.services}
          onBlur={handleBlur}
          onChange={toggleService}
        />
      </Form.Field>
      <Form.Field error={touched.title && !!errors.title} required>
        <Form.Checkbox
          data-testid="is-major"
          type="checkbox"
          id="isMajor"
          name="isMajor"
          label="This is a major release"
          checked={values.isMajor}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </Form.Field>
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'start button']
            : ['button', 'start button'],
        })}
      >
        {({logEvent}) => (
          <Button
            color="purple"
            data-testid="start-release-submit"
            type="submit"
            floated="right"
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
            onClick={() => isValid && logEvent('click')}
          >
            Start
          </Button>
        )}
      </Amplitude>
      <Button
        type="button"
        floated="right"
        content="Cancel"
        onClick={() => history.push(`/releases/history`)}
      />
      {errors.all && (
        <Message negative title="Error" content={errors.all.message} />
      )}
    </Segment>
  );
};

const FormikWrapper = ({handleSubmit, ...props}) => (
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
        title: '',
        description: '',
        isMajor: false,
        studies: [],
        services: [],
      }}
      validate={values => {
        const errors = {};
        if (!values.title) {
          errors.title = 'A title is required';
        }
        if (values.studies.length <= 0) {
          errors.studies = 'At least one study is required';
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <NewReleaseForm {...props} {...formikProps} />
        </Form>
      )}
    </Formik>
  </Amplitude>
);

export default FormikWrapper;
