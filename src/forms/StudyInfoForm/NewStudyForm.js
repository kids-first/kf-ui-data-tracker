import React, {useState, Fragment} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Form,
  Segment,
  Message,
  Step,
  Icon,
  List,
  Button,
} from 'semantic-ui-react';
import {Formik} from 'formik';
import {InfoStep, ExternalStep, LogisticsStep} from './Steps';
import ProgressBar from '../../components/StudyInfo/ProgressBar';
import {
  fieldLabel,
  trackedStudyFields,
  steppingFields,
  prevNextStep,
} from '../../common/notificationUtils';

/**
 * A form for the user to create or update a study, displaying in three steps
 */
const NewStudyForm = ({
  submitValue,
  apiErrors,
  studyNode,
  newStudy,
  editing,
  history,
  allowEdit,
  submitting,
}) => {
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
  const initStep = STUDY_STEPS.findIndex(
    ({href}) =>
      href ===
      history.location.pathname.split('/')[
        history.location.pathname.split('/').length - 1
      ],
  );
  const [workflowType, setSelection] = useState([
    'bwa_mem',
    'gatk_haplotypecaller',
  ]);
  const [focused, setFocused] = useState('');
  const [foldDescription, setFoldDescription] = useState(true);
  const [currentStep, setCurrentStep] = useState(initStep);

  const missingValueMessage = values => {
    let fields = steppingFields.reduce((acc, stepsArr, step) => {
      return acc.concat(
        stepsArr
          .filter(
            field =>
              trackedStudyFields.includes(field) &&
              (!values[field] ||
                values[field].length === 0 ||
                values[field] === 0),
          )
          .map(f => ({label: fieldLabel[f], step})),
      );
    }, []);
    return fields;
  };
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
          submitValue({input: inputObject, workflowType: workflowType});
        } else {
          submitValue(values);
        }
      }}
    >
      {formikProps => (
        <Fragment>
          {apiErrors && (
            <Message
              negative
              icon="attention"
              header="Error"
              content={apiErrors}
            />
          )}
          {!newStudy &&
            allowEdit &&
            missingValueMessage(formikProps.values).length > 0 && (
              <Message negative icon>
                <Icon name="warning circle" />
                <Message.Content>
                  <Message.Header>Missing values</Message.Header>
                  <p>Please add values to the following fields:</p>
                  <List bulleted horizontal>
                    {missingValueMessage(formikProps.values).map(item => (
                      <List.Item
                        as={Link}
                        to={`/study/${
                          history.location.pathname.split('/')[2]
                        }/basic-info/${STUDY_STEPS[item.step].href}`}
                        key={item.label}
                        content={item.label}
                      />
                    ))}
                  </List>
                </Message.Content>
              </Message>
            )}
          <Step.Group attached="top" fluid widths={3}>
            {STUDY_STEPS.map((step, stepNum) => (
              <Step
                link
                key={stepNum}
                active={history.location.pathname.endsWith(step.href)}
                onClick={() => {
                  setCurrentStep(stepNum);
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
              >
                <Icon circular name={step.icon} />
                <Step.Content>
                  <Step.Title>{step.title}</Step.Title>
                  <Step.Description>{step.desc}</Step.Description>
                  {editing && (
                    <ProgressBar values={formikProps.values} step={stepNum} />
                  )}
                </Step.Content>
              </Step>
            ))}
          </Step.Group>
          <Segment padded clearing attached>
            <Form onSubmit={formikProps.handleSubmit}>
              <Switch>
                {STUDY_STEPS.map((step, stepNum) => (
                  <Route
                    key={stepNum}
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
                        history,
                        editing,
                        foldDescription,
                        setFoldDescription,
                        allowEdit,
                      })
                    }
                  />
                ))}
              </Switch>
              {currentStep !== 0 && (
                <Button
                  floated="left"
                  type="button"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                    prevNextStep(
                      STUDY_STEPS[currentStep - 1].href,
                      newStudy,
                      history,
                    );
                  }}
                  labelPosition="left"
                  icon="left arrow"
                  content="PREVIOUS"
                />
              )}
              {currentStep !== STUDY_STEPS.length - 1 && (
                <Button
                  floated="right"
                  type="button"
                  onClick={() => {
                    setCurrentStep(currentStep + 1);
                    prevNextStep(
                      STUDY_STEPS[currentStep + 1].href,
                      newStudy,
                      history,
                    );
                  }}
                  labelPosition="right"
                  icon="right arrow"
                  content="NEXT"
                />
              )}
              {editing && (
                <Button
                  primary
                  floated="right"
                  type="submit"
                  disabled={
                    Object.keys(formikProps.errors).length > 0 ||
                    formikProps.values.name.length === 0 ||
                    formikProps.values.externalId.length === 0
                  }
                >
                  SAVE
                </Button>
              )}
              {newStudy && (
                <Button
                  primary
                  floated="right"
                  type="button"
                  loading={submitting}
                  disabled={
                    submitting ||
                    Object.keys(formikProps.errors).length > 0 ||
                    formikProps.values.name.length === 0 ||
                    formikProps.values.externalId.length === 0
                  }
                  onClick={() => {
                    formikProps.validateForm().then(errors => {
                      Object.keys(formikProps.errors).length === 0 &&
                        formikProps.handleSubmit();
                    });
                  }}
                >
                  SUBMIT
                </Button>
              )}
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
