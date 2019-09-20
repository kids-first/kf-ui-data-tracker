import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Form, Segment, Message, Step} from 'semantic-ui-react';
import {Formik} from 'formik';
import {InfoStep, ExternalStep, GrantStep} from './StudyFormSteps';

const NewStudyForm = ({submitValue, apiErrors}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [workflowType, setSelection] = useState([
    'bwa_mem',
    'gatk_haplotypecaller',
  ]);
  const [focused, setFocused] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const STUDY_STEPS = [
    {
      title: 'Info',
      desc: 'General Study Details',
      icon: 'info',
      comp: InfoStep,
    },
    {
      title: 'External',
      desc: 'For dbGaP project',
      icon: 'disk',
      comp: ExternalStep,
    },
    {
      title: 'logistics',
      desc: 'Scheduling & Collection',
      icon: 'calendar check',
      comp: GrantStep,
    },
  ];
  const newStudy = true;
  return (
    <Formik
      initialValues={{
        externalId: '',
        name: '',
        shortName: '',
        description: '',
        releaseDate: '',
        version: '',
        attribution: '',
        anticipatedSamples: 0,
        awardeeOrganization: '',
      }}
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
        setConfirmOpen(false);
        var inputObject = values;
        if (values.releaseDate.length === 0) {
          inputObject.releaseDate = null;
        }
        submitValue({input: inputObject, workflowType: workflowType});
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
          <Step.Group attached="top" fluid widths={3}>
            {STUDY_STEPS.map(step => (
              <Step
                link
                key={STUDY_STEPS.indexOf(step)}
                active={activeStep === STUDY_STEPS.indexOf(step)}
                onClick={() => setActiveStep(STUDY_STEPS.indexOf(step))}
                icon={step.icon}
                title={step.title}
                description={step.desc}
              />
            ))}
          </Step.Group>
          <Segment padded clearing attached>
            <Form onSubmit={formikProps.handleSubmit}>
              {STUDY_STEPS[activeStep].comp({
                newStudy,
                formikProps,
                setActiveStep,
                setFocused,
                focused,
                setSelection,
                workflowType,
                setConfirmOpen,
                confirmOpen,
              })}
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
