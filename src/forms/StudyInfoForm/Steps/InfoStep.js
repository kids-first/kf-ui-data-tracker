import React from 'react';
import {Header} from 'semantic-ui-react';
import FormField from '../../FormField';

const InfoStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  newStudy,
  history,
  editing,
  allowEdit,
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
          allowEdit={allowEdit}
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
      {!newStudy && (
        <FormField
          allowEdit={allowEdit}
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
    </>
  );
};

export default InfoStep;
