import React, {useState, Fragment} from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Form, Segment, Message, Step, Button, Header} from 'semantic-ui-react';
import {Formik} from 'formik';
import {InfoStep, ExternalStep, LogisticsStep} from './StudyFormSteps';

const NewStudyForm = ({
  submitValue,
  apiErrors,
  studyNode,
  newStudy,
  setEditing,
  editing,
  history,
  isAdmin,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [workflowType, setSelection] = useState([
    'bwa_mem',
    'gatk_haplotypecaller',
  ]);
  const [focused, setFocused] = useState('');
  const STUDY_STEPS = [
    {
      title: 'Info',
      desc: 'General Study Details',
      icon: 'info',
      comp: InfoStep,
      href: 'info',
    },
    {
      title: 'External',
      desc: 'For dbGaP project',
      icon: 'disk',
      comp: ExternalStep,
      href: 'external',
    },
    {
      title: 'Logistics',
      desc: 'Scheduling & Collection',
      icon: 'calendar check',
      comp: LogisticsStep,
      href: 'logistics',
    },
  ];
  const initialValues = studyNode
    ? {
        externalId: studyNode.externalId || '',
        name: studyNode.name || '',
        shortName: studyNode.shortName || '',
        description: studyNode.description || '',
        releaseDate: studyNode.releaseDate || '',
        anticipatedSamples: studyNode.anticipatedSamples || 0,
        awardeeOrganization: studyNode.awardeeOrganization || '',
        attribution: studyNode.attribution || '',
        version: studyNode.version || '',
        bucket: studyNode.bucket || '',
      }
    : {
        externalId: '',
        name: '',
        shortName: '',
        description: '',
        releaseDate: '',
        version: '',
        attribution: '',
        anticipatedSamples: 0,
        awardeeOrganization: '',
      };
  return (
    <Formik
      initialValues={initialValues}
      validate={values => {
        let errors = {};
        if (!values.externalId) {
          errors.externalId = 'Required';
        }
        if (!values.name) {
          errors.name = 'Required';
        }
        if (values.anticipatedSamples < 0) {
          errors.anticipatedSamples =
            'Please tell us how many samples you are anticipating';
        }
        if (values.version.length > 10) {
          errors.version =
            'Max. 10 characters, typically in the format v[0-9].p[0-9]';
        }
        return errors;
      }}
      onSubmit={(values, {setSubmitting}) => {
        setSubmitting(false);
        var inputObject = values;
        if (values.releaseDate != null && values.releaseDate.length === 0) {
          inputObject.releaseDate = null;
        }
        if (newStudy) {
          setConfirmOpen(false);
          submitValue({input: inputObject, workflowType: workflowType});
        } else {
          setEditing(false);
          submitValue(values);
        }
      }}
    >
      {formikProps => (
        <Fragment>
          {!newStudy && (
            <Header as="h2" className="mt-6" floated="left">
              Study Basic Info
            </Header>
          )}
          {!newStudy && isAdmin && editing && (
            <Button.Group floated="right" size="small">
              <Button
                primary
                type="submit"
                disabled={
                  Object.keys(formikProps.errors).length > 0 ||
                  formikProps.values.name.length === 0 ||
                  formikProps.values.externalId.length === 0
                }
                onClick={() => formikProps.handleSubmit()}
                content="SAVE"
              />
              <Button
                type="button"
                onClick={() => {
                  formikProps.handleReset();
                  setEditing(false);
                }}
                content="CANCEL"
              />
            </Button.Group>
          )}
          {!newStudy && isAdmin && !editing && (
            <Button
              floated="right"
              size="small"
              primary
              type="button"
              onClick={() => setEditing(true)}
              content="EDIT"
            />
          )}
          {apiErrors && (
            <Message
              negative
              icon="attention"
              header="Error"
              content={apiErrors}
            />
          )}
          <Step.Group attached="top" fluid widths={3}>
            {STUDY_STEPS.map(step => (
              <Step
                link
                key={STUDY_STEPS.indexOf(step)}
                active={history.location.pathname.endsWith(step.href)}
                onClick={() => {
                  if (newStudy) {
                    history.push('/study/new-study/' + step.href);
                  } else {
                    history.push(
                      '/study/' +
                        history.location.pathname.split('/')[2] +
                        '/basic-info/' +
                        step.href,
                    );
                  }
                }}
                icon={step.icon}
                title={step.title}
                description={step.desc}
              />
            ))}
          </Step.Group>
          <Segment padded clearing attached>
            <Form onSubmit={formikProps.handleSubmit}>
              <Switch>
                {STUDY_STEPS.map(step => (
                  <Route
                    key={STUDY_STEPS.indexOf(step)}
                    path={
                      newStudy
                        ? '/study/new-study/' + step.href
                        : '/study/' +
                          history.location.pathname.split('/')[2] +
                          '/basic-info/' +
                          step.href
                    }
                    render={() =>
                      step.comp({
                        newStudy,
                        formikProps,
                        setFocused,
                        focused,
                        setSelection,
                        workflowType,
                        setConfirmOpen,
                        confirmOpen,
                        history,
                        editing,
                      })
                    }
                  />
                ))}
              </Switch>
            </Form>
          </Segment>
        </Fragment>
      )}
    </Formik>
  );
};

NewStudyForm.propTypes = {
  /** Function to perform on form submission */
  submitValue: PropTypes.func.isRequired,
  /** Error message returned from server or API */
  apiErrors: PropTypes.string,
};

export default NewStudyForm;
