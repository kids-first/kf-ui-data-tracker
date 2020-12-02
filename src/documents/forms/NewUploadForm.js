import React, {useEffect, useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Form, Grid, Message, Step} from 'semantic-ui-react';
import {Formik} from 'formik';
import {EditorState, ContentState} from 'draft-js';

import {
  ChooseTypeStep,
  DocumentOrVersionStep,
  EnterDetailsStep,
  ChooseDocumentStep,
  VersionDescriptionStep,
} from '../components/UploadSteps';

import {fileTypeDetail} from '../../common/enums';

const Steps = ({step = 1, setStep}) => (
  <Step.Group ordered fluid attached="top">
    <Step
      active={step === 1}
      completed={step > 1}
      onClick={step > 1 ? () => setStep(1) : null}
    >
      <Step.Content>
        <Step.Title>New or Existing</Step.Title>
        <Step.Description>Choose the document</Step.Description>
      </Step.Content>
    </Step>

    <Step
      active={step === 2}
      completed={step > 2}
      onClick={step > 2 ? () => setStep(2) : null}
    >
      <Step.Content>
        <Step.Title>Document Type</Step.Title>
        <Step.Description>Categorize your new document</Step.Description>
      </Step.Content>
    </Step>

    <Step active={step === 3}>
      <Step.Content>
        <Step.Title>Details</Step.Title>
        <Step.Description>Describe the new document</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
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
  const [step, setStep] = useState(1);

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
      <Steps step={step} setStep={setStep} />
      <Grid divided padded>
        {step === 1 && (
          <DocumentOrVersionStep
            setFieldValue={v => {
              setFieldValue('upload_type', v);
            }}
            nextStep={() => setStep(2)}
          />
        )}
        {step === 2 && values.upload_type === 'document' && (
          <ChooseTypeStep
            expeditedTypes={expeditedTypes}
            generalTypes={generalTypes}
            previousStep={() => setStep(1)}
            nextStep={() => setStep(3)}
          />
        )}
        {step === 2 && values.upload_type === 'version' && (
          <ChooseDocumentStep
            values={values}
            setFieldValue={setFieldValue}
            studyFiles={studyFiles}
            previousStep={() => setStep(1)}
            nextStep={() => setStep(3)}
          />
        )}
        {step === 3 && values.upload_type === 'document' && (
          <EnterDetailsStep
            nextStep={() => setStep(3)}
            previousStep={() => setStep(2)}
            {...{
              editorState,
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
              isValid,
              setEditorState,
              setFieldValue,
              setFieldTouched,
            }}
          />
        )}
        {step === 3 && values.upload_type === 'version' && (
          <VersionDescriptionStep
            nextStep={() => setStep(3)}
            previousStep={() => setStep(2)}
            {...{
              editorState,
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
              isValid,
              setEditorState,
              setFieldValue,
              setFieldTouched,
            }}
          />
        )}
      </Grid>
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
        upload_type: 'version',
        file_name: '',
        file_type: null,
        file_desc: '',
        file_status: 'PEN',
        doc: null,
      }}
      validate={vals => {
        let errors = {};
        if (vals.upload_type === 'document') {
          if (!vals.file_name) errors.file_name = 'required';
          if (!vals.file_desc.trim()) errors.file_desc = 'required';
          if (!vals.file_type.trim()) errors.file_type = 'required';
          if (
            vals.file_name &&
            studyFiles.filter(
              ({node}) =>
                node.name.toLowerCase() === vals.file_name.toLowerCase(),
            ).length > 0
          ) {
            errors.file_name = 'exists';
          }
        } else if (vals.upload_type === 'version') {
          if (!vals.file_desc) errors.file_name = 'required';
          if (!vals.doc) errors.file_name = 'required';
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
