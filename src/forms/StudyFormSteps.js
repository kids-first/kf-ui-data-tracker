import React from 'react';
import {
  Form,
  Segment,
  Container,
  Button,
  Confirm,
  List,
  Dropdown,
  Header,
} from 'semantic-ui-react';
import {workflowOptions} from '../common/enums';
import FormField from './FormField';

const prevNextStep = (stepName, newStudy, history) => {
  if (newStudy) {
    history.push('/study/new-study/' + stepName);
  } else {
    history.push(
      '/study/' +
        history.location.pathname.split('/')[2] +
        '/basic-info/' +
        stepName,
    );
  }
};

export const InfoStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  setSelection,
  workflowType,
  newStudy,
  history,
}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
  return (
    <>
      <Header
        as="h4"
        className="text-wrap-75"
        content="Please provide the study's full name and a shortened version that may be used for display purposes."
      />
      <FormField
        required
        id="name"
        name="Study Name"
        description="Full name of the study, often the full title of the X01 grant application."
        focused={focused === 'name'}
        value={values.name}
        touched={touched.name}
        errors={errors.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
        descriptionDisplay="tooltip"
      />
      <FormField
        id="shortName"
        name="Study Short Name"
        description="The name that will appear under portal facets."
        type="text"
        focused={focused === 'shortName'}
        value={values.shortName}
        touched={touched.shortName}
        errors={errors.shortName}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      {newStudy ? (
        <FormField
          id="workflowType"
          name="Cavatica Projects"
          description="Workflow projects to be instantiated for the new study."
          focused={focused === 'workflowType'}
          value={values.workflowType}
          touched={touched.workflowType}
          errors={errors.workflowType}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleFocus={id => setFocused(id)}
        >
          <Dropdown
            id="workflowType"
            name="workflowType"
            placeholder="Workflow Type"
            fluid
            selection
            clearable
            multiple
            options={workflowOptions}
            onChange={(e, {value}) => {
              setSelection(value);
            }}
            value={workflowType}
          />
        </FormField>
      ) : (
        <FormField
          id="bucket"
          name="S3 Bucket"
          description="The s3 bucket where data for this study resides."
          type="text"
          focused={focused === 'bucket'}
          value={values.bucket}
          touched={touched.bucket}
          errors={errors.bucket}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleFocus={id => setFocused(id)}
        />
      )}
      <Button
        primary
        floated="right"
        type="button"
        onClick={() => prevNextStep('external', newStudy, history)}
        labelPosition="right"
        icon="right arrow"
        content="NEXT"
        disabled={values.name.length === 0}
      />
    </>
  );
};

export const ExternalStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  history,
}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
  return (
    <>
      <Header
        as="h4"
        className="text-wrap-75"
        content="If the study is a dbGaP project, additional information is needed to ensure access is granted correctly. For non-dbGaP studies, an external identifier which this study may otherwise be known by is required."
      />
      <FormField
        required
        id="externalId"
        name="External ID"
        description="Identifier used by external systems, often the PHS ID if the study is registered with dbGaP."
        type="text"
        focused={focused === 'externalId'}
        placeholder="phs000178"
        value={values.externalId}
        touched={touched.externalId}
        errors={errors.externalId}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      <FormField
        id="version"
        name="dbGaP Version"
        placeholder="v1.p1"
        description="Study version, often the provided by the data access authority."
        type="text"
        focused={focused === 'version'}
        value={values.version}
        touched={touched.version}
        errors={errors.version}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      <FormField
        id="attribution"
        name="Attribution"
        description="The URL providing more information about the study."
        type="text"
        focused={focused === 'attribution'}
        value={values.attribution}
        touched={touched.attribution}
        errors={errors.attribution}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      <Button
        primary
        floated="left"
        type="button"
        onClick={() => prevNextStep('info', newStudy, history)}
        labelPosition="left"
        icon="left arrow"
        content="PREVIOUS"
      />
      <Button
        primary
        floated="right"
        type="button"
        onClick={() => prevNextStep('logistics', newStudy, history)}
        labelPosition="right"
        icon="right arrow"
        content="NEXT"
        disabled={values.externalId.length === 0}
      />
    </>
  );
};

export const GrantStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  setConfirmOpen,
  confirmOpen,
  workflowType,
  history,
}) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    validateForm,
  } = formikProps;
  return (
    <>
      <Header
        as="h4"
        className="text-wrap-75"
        content="Provide details about the Kids First grant that this study was awarded."
      />
      <FormField
        id="releaseDate"
        name="Release Date"
        description="The anticipated date on which this study's data will be made public in Kids First."
        type="date"
        focused={focused === 'releaseDate'}
        value={values.releaseDate}
        touched={touched.releaseDate}
        errors={errors.releaseDate}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      <FormField
        id="anticipatedSamples"
        name="Number of anticipated samples"
        description="The anticipated number of samples awarded for sequencing for the study."
        type="number"
        focused={focused === 'anticipatedSamples'}
        value={values.anticipatedSamples}
        touched={touched.anticipatedSamples}
        errors={errors.anticipatedSamples}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      <FormField
        id="awardeeOrganization"
        name="Awardee organization"
        description="The organization responsible for this study."
        type="text"
        focused={focused === 'awardeeOrganization'}
        value={values.awardeeOrganization}
        touched={touched.awardeeOrganization}
        errors={errors.awardeeOrganization}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      />
      <FormField
        id="description"
        name="Description"
        description="Study description in markdown, commonly the X01 abstract
      text."
        type="text"
        focused={focused === 'description'}
        value={values.description}
        touched={touched.description}
        errors={errors.description}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
      >
        <Form.TextArea
          rows="15"
          type="text"
          name="description"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
        />
      </FormField>
      <Button
        primary
        floated="left"
        type="button"
        onClick={() => prevNextStep('external', newStudy, history)}
        labelPosition="left"
        icon="left arrow"
        content="PREVIOUS"
      />
      <Button
        primary
        floated="right"
        type="button"
        disabled={
          Object.keys(errors).length > 0 ||
          values.name.length === 0 ||
          values.externalId.length === 0
        }
        onClick={() => {
          validateForm().then(errors => {
            Object.keys(errors).length === 0 && setConfirmOpen(true);
          });
        }}
      >
        SUBMIT
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        header="Create Study"
        content={
          <Container as={Segment} basic padded>
            <p>The following resources will be created for this study</p>
            <List bulleted>
              <List.Item>Dataservice study</List.Item>
              <List.Item>S3 bucket</List.Item>
              <List.Item>Cavatica delivery project</List.Item>
              {workflowType.length > 0 && (
                <List.Item>
                  Cavatica harmonization projects
                  <List.List>
                    {workflowType.map(type => (
                      <List.Item key={type}>
                        {
                          workflowOptions.filter(obj => obj.value === type)[0]
                            .text
                        }
                      </List.Item>
                    ))}
                  </List.List>
                </List.Item>
              )}
            </List>
          </Container>
        }
        confirmButton={
          <Button primary floated="right" type="submit" loading={isSubmitting}>
            SUBMIT
          </Button>
        }
      />
    </>
  );
};
