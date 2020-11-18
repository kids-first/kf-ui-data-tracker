import React, {useRef} from 'react';
import {Button, Message, Modal, Form} from 'semantic-ui-react';
import SelectElement from '../components/FileDetail/SelectElement';
import {fileTypeDetail} from '../../common/enums';
import {Formik, Field} from 'formik';

const EditDocumentModal = ({
  fileNode,
  onCloseDialog,
  studyId,
  updateFile,
  updateError,
}) => {
  const formEl = useRef(null);
  const handleSubmit = async fileType => {
    if (fileNode.fileType !== fileType) {
      updateFile({
        variables: {kfId: fileNode.kfId, fileType},
      })
        .then(resp => onCloseDialog())
        .catch(err => console.log(err));
    }
  };
  return (
    <Modal open={true} onClose={onCloseDialog} size="small" closeIcon>
      <Modal.Header content="Edit Document Type" />
      <Modal.Content scrolling>
        <Formik
          initialValues={{
            file_type: fileNode.fileType,
          }}
          validate={vals => {
            let errors = {};
            if (!vals.file_type) {
              errors.file_type = 'Required';
            }
            return errors;
          }}
          onSubmit={values => {
            handleSubmit(...Object.values(values));
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            validateForm,
          }) => (
            <Form onSubmit={handleSubmit} ref={formEl} className="mb-15">
              <Form.Field required>
                {Object.keys(fileTypeDetail).map(item => (
                  <Form.Field
                    key={item}
                    disabled={
                      fileNode.validTypes && !fileNode.validTypes.includes(item)
                    }
                  >
                    <Field
                      component={SelectElement}
                      name="file_type"
                      id={item}
                      label={item}
                    />
                  </Form.Field>
                ))}
              </Form.Field>
            </Form>
          )}
        </Formik>
      </Modal.Content>
      <Modal.Actions>
        {updateError && <Message negative content={updateError.message} />}
        <Button
          primary
          size="mini"
          type="button"
          onClick={e => {
            e.preventDefault();
            formEl.current.handleSubmit();
          }}
        >
          SAVE
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditDocumentModal;
