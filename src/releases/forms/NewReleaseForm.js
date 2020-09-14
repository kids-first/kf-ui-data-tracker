import React, {useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Form, Header, Message, Input, Segment} from 'semantic-ui-react';
import {Formik} from 'formik';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import MarkdownEditor from '../../documents/components/FileDetail/MarkdownEditor';
import draftToMarkdown from 'draftjs-to-markdown';
import {StudyTable} from '../components/StudyTable';

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
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );

  const toggleStudy = study => {
    if (values.studies.filter(s => s.id === study.id).length) {
      setFieldValue('studies', values.studies.filter(s => s.id !== study.id));
    } else {
      setFieldValue('studies', [...values.studies, study]);
    }
  };

  return (
    <>
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
            primary
            data-testid="start-release-submit"
            type="submit"
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
            onClick={() => isValid && logEvent('click')}
          >
            Start
          </Button>
        )}
      </Amplitude>
      {errors.all && (
        <Message negative title="Error" content={errors.all.message} />
      )}
    </>
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
      initialValues={{title: '', description: '', isMajor: false, studies: []}}
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
