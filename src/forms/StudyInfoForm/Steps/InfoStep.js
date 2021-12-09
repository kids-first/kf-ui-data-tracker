import React from 'react';
import {Dropdown, Form, Header} from 'semantic-ui-react';
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
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
  } = formikProps;
  const mapFields = [
    {
      required: true,
      id: 'shortCode',
      name: 'Study Short Code',
      description: 'A short code that identifies the study.',
    },
    {
      required: true,
      id: 'domain',
      name: 'Domain',
      description: 'The category of disease being studied.',
    },
    {
      required: true,
      id: 'program',
      name: 'Program',
      description: 'The administrative organization or group of the study.',
    },
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
    {
      required: false,
      id: 'investigatorName',
      name: 'Principal Investigator',
      description:
        'The name of the principle investigator, used to categorize this study.',
    },
  ];
  const dropdownOptions = [
    {
      key: 'unknown',
      text: 'Unknown',
      value: 'UNKNOWN',
    },
    {
      key: 'cancer',
      text: 'Cancer',
      value: 'CANCER',
    },
    {
      key: 'birthdefect',
      text: 'Birth Defect',
      value: 'BIRTHDEFECT',
    },
    {
      key: 'cancerandbirthdefect',
      text: 'Cancer and Birth Defect',
      value: 'CANCERANDBIRTHDEFECT',
    },
    {
      key: 'covid19',
      text: 'Covid-19',
      value: 'COVID19',
    },
    {
      key: 'other',
      text: 'Other',
      value: 'OTHER',
    }
  ]
  return (
    <>
      <Header
        as="h4"
        className="text-wrap-75"
        content="Please provide the study's full name and a shortened version that may be used for display purposes."
      />
      {mapFields.map(item => {
        if (item.id !== 'domain') {
          return (
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
          )
        }
        else {
          return (
            <Form.Field key={item.id} required={true}>
              <label className="noMargin">Domain:</label>
              <p className="noMargin">
                <small>{item.description}</small>
              </p>
              <Dropdown
                key={item.id}
                id={item.id}
                selection
                options={dropdownOptions}
                fluid
                onChange={(ev, data) => {
                  setFieldValue('domain', data.value);
                }}
                value={values.domain}
              />
            </Form.Field>
          )
        }
      })}
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
