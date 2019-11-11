import React from 'react';
import {Header} from 'semantic-ui-react';
import FormField from '../../FormField';
import {steppingFields} from '../../../common/notificationUtils';
import {LogOnMount} from '@amplitude/react-amplitude';

const ExternalStep = ({
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  editing,
  newStudy,
  history,
  isAdmin,
  studyNode,
  stepNum,
  tracking: {
    instrument,
    EVENT_CONSTANTS: {DOCUMENT_INFO_, INPUT},
  },
}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
  const mapFields = [
    {
      required: true,
      id: 'externalId',
      name: 'External ID',
      description:
        'Identifier used by external systems, often the PHS ID if the study is registered with dbGaP.',
      placeholder: 'Example: phs000178',
    },
    {
      required: false,
      id: 'version',
      name: 'dbGaP Version',
      description:
        'Study version, often the provided by the data access authority.',
      placeholder: 'Example: v1.p1',
    },
    {
      required: false,
      id: 'attribution',
      name: 'Attribution',
      description: 'The URL providing more information about the study.',
      placeholder: '',
    },
  ];
  const studyTrackingProps = {
    study: {
      kfId: studyNode.kfId,
      name: studyNode.name,
      study_created_at: studyNode.createdAt,
    },
  };
  return (
    <>
      <LogOnMount
        eventType={DOCUMENT_INFO_.scope + 'EXTERNAL_STEP'}
        eventProperties={{
          ...studyTrackingProps,
          completed_fileds: steppingFields[stepNum].filter(
            field => values[field] > 0 || values[field] !== '',
          ),
          incomplete_fields: steppingFields[stepNum].filter(
            field => values[field] === 0 || values[field] === '',
          ),
        }}
      />
      <Header
        as="h4"
        className="text-wrap-75"
        content="If the study is a dbGaP project, additional information is needed to ensure access is granted correctly. For non-dbGaP studies, an external identifier which this study may otherwise be known by is required."
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
          placeholder={item.placeholder}
          focused={focused === item.id}
          value={values[item.id]}
          touched={touched[item.id]}
          errors={errors[item.id]}
          handleChange={instrument(INPUT._CHANGE, handleChange, {
            ...studyTrackingProps,
            input_name: item.name,
            value: values[item.id],
          })}
          handleBlur={handleBlur}
          handleFocus={id => setFocused(id)}
          readOnly={!editing && !newStudy}
        />
      ))}
    </>
  );
};

export default ExternalStep;
