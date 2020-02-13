import React, {useState} from 'react';
import {Button, Popup} from 'semantic-ui-react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Formik} from 'formik';
import {ALL_STUDIES, GET_PROJECTS} from '../../state/queries';
import {LINK_PROJECT} from '../../state/mutations';
import {LinkStudyForm} from '../../forms';

export const LinkStudyPopup = ({project}) => {
  const [isOpen, setOpen] = useState(false);

  const {loading, data, error} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'cache-first',
  });

  const [linkProject, {loading: linkLoading}] = useMutation(LINK_PROJECT, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });

  if (loading || !data || error) {
    return <></>;
  }

  const allStudies = data && data.allStudies;

  return (
    <Popup
      on="click"
      position="left center"
      wide="very"
      open={isOpen}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={
        <Button primary basic size="mini" icon="chain" content="LINK STUDY" />
      }
    >
      <Formik
        initialValues={{
          studyId: null,
        }}
        validate={values => {
          let errors = {};
          if (!values.studyId) {
            errors.studyId = 'Required';
          }
          return errors;
        }}
        onSubmit={values => {
          linkProject({
            variables: {
              project: project.id,
              study: values.studyId,
            },
          }).then(resp => setOpen(false));
        }}
      >
        {formikProps => (
          <LinkStudyForm
            allStudies={allStudies}
            formikProps={formikProps}
            loading={linkLoading}
          />
        )}
      </Formik>
    </Popup>
  );
};

export default LinkStudyPopup;
