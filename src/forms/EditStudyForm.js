import React, {useState, Fragment} from 'react';
import {Form} from 'semantic-ui-react';
import FormField from './FormField';

const EditStudyForm = ({formikProps}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
  const [focused, setFocused] = useState('');
  return (
    <Fragment>
      <FormField
        required
        id="name"
        name="Study Name"
        description=" Full name of the study, often the full title of the X01 grant application."
        focused={focused === 'name'}
        value={values.name}
        touched={touched.name}
        errors={errors.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFocus={id => setFocused(id)}
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
      <FormField
        required
        id="externalId"
        name="External ID"
        description="Identifier used by external systems, often the PHS ID if the study is registered with dbGaP."
        type="text"
        focused={focused === 'externalId'}
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
    </Fragment>
  );
};

export default EditStudyForm;
