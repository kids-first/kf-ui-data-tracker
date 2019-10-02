import React from 'react';
import {Button, Header} from 'semantic-ui-react';
import {prevNextStep} from '../../../common/notificationUtils';
import FormField from './FormField';

const ExternalStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  editing,
  newStudy,
  history,
  isAdmin,
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
        isAdmin={isAdmin}
        newStudy={newStudy}
        required
        id="externalId"
        name="External ID"
        description="Identifier used by external systems, often the PHS ID if the study is registered with dbGaP."
        type="text"
        focused={focused === 'externalId'}
        placeholder="Example: phs000178"
        value={values.externalId}
        touched={touched.externalId}
        errors={errors.externalId}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
        readOnly={!editing && !newStudy}
      />
      <FormField
        isAdmin={isAdmin}
        newStudy={newStudy}
        id="version"
        name="dbGaP Version"
        placeholder="Example: v1.p1"
        description="Study version, often the provided by the data access authority."
        type="text"
        focused={focused === 'version'}
        value={values.version}
        touched={touched.version}
        errors={errors.version}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
        readOnly={!editing && !newStudy}
      />
      <FormField
        isAdmin={isAdmin}
        newStudy={newStudy}
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
        readOnly={!editing && !newStudy}
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

export default ExternalStep;
