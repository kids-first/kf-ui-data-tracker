import React, {useState, Fragment} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Form,
  Segment,
  Message,
  Step,
  Header,
  Icon,
  List,
  Button,
  Confirm,
  Container,
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
import {workflowOptions} from '../../common/enums';
import {withAnalyticsTracking} from '../../analyticsTracking';

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
  isAdmin,
  tracking,
}) => {
  const {
    EVENT_CONSTANTS: {STUDY_INFO_},
    buttonTracking,
  } = tracking;
  const studyTrackingProps = {
    study: {
      kfId: studyNode.kfId,
      name: studyNode.name,
      study_created_at: studyNode.createdAt,
    },
  };
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
  const [confirmOpen, setConfirmOpen] = useState(false);
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
          setConfirmOpen(false);
          submitValue({input: inputObject, workflowType: workflowType});
        } else {
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
          {apiErrors && (
            <Message
              negative
              icon="attention"
              header="Error"
              content={apiErrors}
            />
          )}
          {!newStudy &&
            isAdmin &&
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
                        {...buttonTracking(
                          item.label,
                          'link',
                          studyTrackingProps,
                          STUDY_INFO_.scope + 'MISSING_VAL_LINK',
                        )}
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
                        stepNum,
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
                        foldDescription,
                        setFoldDescription,
                        isAdmin,
                        tracking,
                        studyNode,
                      })
                    }
                  />
                ))}
              </Switch>
              {currentStep !== 0 && (
                <Button
                  floated="left"
                  type="button"
                  {...buttonTracking(
                    'PREVIOUS',
                    null,
                    studyTrackingProps,
                    STUDY_INFO_.scope + 'PREVIOUS',
                  )}
                  onClick={() => {
                    buttonTracking(
                      'PREVIOUS',
                      null,
                      studyTrackingProps,
                      STUDY_INFO_.scope + 'PREVIOUS',
                    ).onClick();
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
                  {...buttonTracking(
                    'NEXT',
                    null,
                    studyTrackingProps,
                    STUDY_INFO_.scope + 'NEXT',
                  )}
                  onClick={() => {
                    buttonTracking(
                      'NEXT',
                      null,
                      studyTrackingProps,
                      STUDY_INFO_.scope + 'NEXT',
                    ).onClick();
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
                  {...buttonTracking(
                    'SAVE',
                    null,
                    studyTrackingProps,
                    STUDY_INFO_.SAVE,
                  )}
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
                  disabled={
                    Object.keys(formikProps.errors).length > 0 ||
                    formikProps.values.name.length === 0 ||
                    formikProps.values.externalId.length === 0
                  }
                  onClick={() => {
                    formikProps.validateForm().then(errors => {
                      Object.keys(formikProps.errors).length === 0 &&
                        setConfirmOpen(true);
                    });
                  }}
                >
                  SUBMIT
                </Button>
              )}
              <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={formikProps.handleSubmit}
                header="Create Study"
                content={
                  <Container as={Segment} basic padded>
                    <p>
                      The following resources will be created for this study
                    </p>
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
                                  workflowOptions.filter(
                                    obj => obj.value === type,
                                  )[0].text
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
                  <Button
                    primary
                    floated="right"
                    type="submit"
                    loading={formikProps.isSubmitting}
                  >
                    SUBMIT
                  </Button>
                }
              />
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

export default withAnalyticsTracking(NewStudyForm);
