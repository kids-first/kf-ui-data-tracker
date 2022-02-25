import {
  ChooseDocumentStep,
  ChooseTypeStep,
  DocumentOrVersionStep,
  EnterDetailsStep,
  NewExperienceStep,
  VersionDescriptionStep,
} from '../components/UploadSteps';
import {ContentState, EditorState} from 'draft-js';
import {Form, Grid, Icon, Message, Step} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';

import {Amplitude} from '@amplitude/react-amplitude';
import {Formik} from 'formik';
import {fileTypeDetail} from '../../common/enums';

const Steps = ({step = 1, setStep, type}) => (
  <Step.Group fluid attached="top">
    <Step
      active={step === 1}
      completed={step > 1}
      onClick={step > 1 ? () => setStep(1) : null}
    >
      <Icon name="add" />
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
      <Icon name={type === 'document' ? 'th large' : 'clone'} />
      <Step.Content>
        <Step.Title>
          {type === 'document' ? 'Document Type' : 'Select Document'}
        </Step.Title>
        <Step.Description>
          {type === 'document'
            ? 'Categorize your new document'
            : 'Choose the document this revision is for'}
        </Step.Description>
      </Step.Content>
    </Step>

    <Step
      active={step === 3}
      completed={step > 3}
      onClick={step > 3 ? () => setStep(3) : null}
    >
      <Icon name="sticky note" />
      <Step.Content>
        <Step.Title>Details</Step.Title>
        <Step.Description>
          {type === 'document'
            ? 'Describe the new document'
            : 'Describe the new version'}
        </Step.Description>
      </Step.Content>
    </Step>

    <Step active={step === 4}>
      <Icon name="sitemap" />
      <Step.Content>
        <Step.Title>New Experience</Step.Title>
        <Step.Description>Try file mapping with Flatfile</Step.Description>
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
  setSubmitting,
  setErrors,
  handleBlur,
  handleChange,
  handleSubmit,
  version,
  setFieldValue,
  setFieldTouched,
  studyFiles,
  templates,
  evaluateTemplateMatch,
  study,
  selectedTemplate,
  setSelectedTemplate,
  createFlatfileSettings,
  history,
  match,
  createVersion,
  updateVersion,
  saveDocument,
  uploadedFile,
  mappedData,
  setMappedData,
}) => {
  const [step, setStep] = useState(1);
  const [evaluateResult, setEvaluateResult] = useState({});

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
      <Steps step={step} setStep={setStep} type={values.upload_type} />
      <Grid divided padded>
        {step === 1 && (
          <DocumentOrVersionStep
            setFieldValue={v => {
              setFieldValue('upload_type', v);
              evaluateTemplateMatch({
                variables: {
                  input: {
                    fileVersion: version.id,
                    study: study.id,
                  },
                },
              })
                .then(resp => {
                  setEvaluateResult(resp.data.evaluateTemplateMatch);
                })
                .catch(err => {
                  setEvaluateResult(err);
                });
            }}
            nextStep={() => setStep(2)}
          />
        )}
        {step === 2 && values.upload_type === 'document' && (
          <ChooseTypeStep
            version={version}
            studyId={study.kfId}
            templates={
              templates.data ? templates.data.allTemplateVersions.edges : []
            }
            expeditedTypes={expeditedTypes}
            generalTypes={generalTypes}
            previousStep={() => setStep(1)}
            nextStep={() => setStep(3)}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            evaluateResult={evaluateResult}
            setFieldValue={setFieldValue}
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
            nextStep={() => setStep(4)}
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
            nextStep={() => setStep(4)}
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
        {step === 4 && (
          <NewExperienceStep
            nextStep={() => setStep(4)}
            previousStep={() => setStep(3)}
            createFlatfileSettings={createFlatfileSettings}
            selectedTemplate={
              values.upload_type === 'version'
                ? values.doc.templateVersion
                  ? values.doc.templateVersion.id
                  : ''
                : selectedTemplate
            }
            version={version}
            history={history}
            match={match}
            createVersion={createVersion}
            updateVersion={updateVersion}
            saveDocument={saveDocument}
            uploadedFile={uploadedFile}
            mappedData={mappedData}
            setMappedData={setMappedData}
            {...{
              values,
              isSubmitting,
              isValid,
              setSubmitting,
              setErrors,
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
