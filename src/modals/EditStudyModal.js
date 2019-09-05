import React, {useState} from 'react';
import {EditStudyForm} from '../forms';
import {Button, Modal, Form, Message} from 'semantic-ui-react';
import {Formik} from 'formik';

const EditStudyModal = ({studyNode, updateStudy, onCloseDialog}) => {
  const [apiErrors, setApiErrors] = useState(null);
  const submitUpdate = values => {
    var inputObject = values;
    if (values.releaseDate.length === 0) {
      inputObject.releaseDate = null;
    }
    updateStudy({
      variables: {
        id: studyNode.id,
        input: inputObject,
      },
    })
      .then(() => {
        onCloseDialog();
        setApiErrors(null);
      })
      .catch(err => setApiErrors(err.message));
  };
  return (
    <Formik
      initialValues={{
        externalId: studyNode.externalId || '',
        name: studyNode.name || '',
        shortName: studyNode.shortName || '',
        description: studyNode.description || '',
        releaseDate: studyNode.releaseDate || '',
        anticipatedSamples: studyNode.anticipatedSamples || 0,
        awardeeOrganization: studyNode.awardeeOrganization || '',
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
          errors.anticipatedSamples = 'Invalid number of anticipated samples';
        }
        return errors;
      }}
      onSubmit={(values, {setSubmitting}) => {
        setSubmitting(false);
        submitUpdate(values);
      }}
    >
      {formikProps => (
        <Modal
          onSubmit={formikProps.handleSubmit}
          as={Form}
          open={true}
          onClose={onCloseDialog}
          size="large"
          closeIcon
        >
          <Modal.Header content="Edit Study Info" />
          <Modal.Content scrolling>
            {apiErrors && (
              <Message size="mini" negative>
                {apiErrors}
              </Message>
            )}
            <EditStudyForm formikProps={formikProps} />
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              size="mini"
              type="submit"
              loading={formikProps.isSubmitting}
              disabled={Object.keys(formikProps.errors).length > 0}
            >
              SAVE
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

export default EditStudyModal;
