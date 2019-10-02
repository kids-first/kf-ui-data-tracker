import React from 'react';
import {Button, Dropdown, Header} from 'semantic-ui-react';
import {workflowOptions} from '../../../common/enums';
import {prevNextStep} from '../../../common/notificationUtils';
import FormField from './FormField';

const InfoStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  setSelection,
  workflowType,
  newStudy,
  history,
  editing,
  isAdmin,
}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
  const mapFields = [
    {
      required: true,
      id: 'name',
      name: 'Study Name',
      description:
        'Full name of the study, often the full title of the X01 grant application.',
    },
    {
      required: false,
      id: 'shortName',
      name: 'Study Short Name',
      description: 'The name that will appear under portal facets.',
    },
  ];
  return (
    <>
      <Header
        as="h4"
        className="text-wrap-75"
        content="Please provide the study's full name and a shortened version that may be used for display purposes."
      />
      {mapFields.map(item => (
        <FormField
          key={item.id}
          isAdmin={isAdmin}
          newStudy={newStudy}
          required={item.required}
          id={item.id}
          name={item.name}
          description={item.description}
          focused={focused === item.id}
          value={values[item.id]}
          touched={touched[item.id]}
          errors={errors[item.id]}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleFocus={id => setFocused(id)}
          readOnly={!editing && !newStudy}
        />
      ))}
      {newStudy ? (
        <FormField
          isAdmin={isAdmin}
          newStudy={newStudy}
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
          isAdmin={isAdmin}
          newStudy={newStudy}
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
          readOnly={!editing && !newStudy}
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

export default InfoStep;
